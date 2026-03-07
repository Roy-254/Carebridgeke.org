import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service-role client — this never runs in the browser
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Helpers ──────────────────────────────────────────────────────
function generateCode(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const rand = Math.random().toString(36).toUpperCase().slice(2, 6).padEnd(4, "0");
    return `CBK-${date}-${rand}`;
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidKenyanPhone(phone: string): boolean {
    // Accept formats like 712345678, 0712345678, +254712345678
    const cleaned = phone.replace(/\s+/g, "");
    return /^(?:\+254|0)?[17]\d{8}$/.test(cleaned) ||
        /^(?:\+254|0)?[2-9]\d{8}$/.test(cleaned);
}

function normalisePhone(phone: string): string {
    const cleaned = phone.replace(/\s+/g, "").replace(/^0/, "+254");
    if (!cleaned.startsWith("+")) return `+254${cleaned}`;
    return cleaned;
}

// ─── POST /api/donations/manual ───────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            donor_name,
            donor_email,
            donor_phone,
            amount,
            currency = "KES",
            donation_type = "general",   // "general" | "project" | "category"
            campaign_id,                 // uuid — set if donation_type === "project"
            project_category,            // string — set if donation_type === "category"
            campaign_title,              // human-readable, for email only
            subscribe_updates = false,
            is_anonymous = false,
            message,
        } = body;

        // ── Validation ──────────────────────────────────────────
        if (!donor_email || !isValidEmail(donor_email)) {
            return NextResponse.json({ error: "Valid email address is required." }, { status: 400 });
        }
        if (!donor_phone || !isValidKenyanPhone(donor_phone)) {
            return NextResponse.json({ error: "Valid Kenyan phone number is required." }, { status: 400 });
        }
        if (!amount || Number(amount) < 100) {
            return NextResponse.json({ error: "Minimum donation amount is KES 100." }, { status: 400 });
        }

        const phone = normalisePhone(donor_phone);

        // ── Generate unique confirmation code (retry on collision) ──
        let confirmationCode = generateCode();
        for (let i = 0; i < 5; i++) {
            const { data: existing } = await supabaseAdmin
                .from("donations")
                .select("id")
                .eq("confirmation_code", confirmationCode)
                .maybeSingle();
            if (!existing) break;
            confirmationCode = generateCode();
        }

        // ── Insert donation row ─────────────────────────────────
        const { data: donation, error: insertError } = await supabaseAdmin
            .from("donations")
            .insert({
                campaign_id: donation_type === "project" ? campaign_id : null,
                donor_name: is_anonymous ? null : (donor_name?.trim() || null),
                donor_email: donor_email.trim().toLowerCase(),
                donor_phone: phone,
                amount: Number(amount),
                currency,
                payment_method: "mpesa-manual",
                is_anonymous,
                message: message?.trim() || null,
                status: "pending",
                fund_status: "pending",
                confirmation_code: confirmationCode,
                donation_type,
                project_category: donation_type === "category" ? project_category : null,
                subscribe_updates,
            })
            .select()
            .single();

        if (insertError || !donation) {
            console.error("Donation insert error:", insertError);
            return NextResponse.json({ error: "Failed to save donation. Please try again." }, { status: 500 });
        }

        // ── Send confirmation email (fire-and-forget) ───────────
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const displayName = is_anonymous ? "there" : (donor_name?.trim() || "there");
        const supportingLabel =
            donation_type === "project" ? (campaign_title || "a specific project") :
                donation_type === "category" ? project_category :
                    "our General Fund";

        const trackingUrl = `${appUrl}/track?code=${confirmationCode}`;

        const formattedAmount = new Intl.NumberFormat("en-KE", {
            style: "currency", currency, minimumFractionDigits: 0,
        }).format(Number(amount));

        const emailHtml = buildConfirmationEmail({
            displayName,
            formattedAmount,
            amount: Number(amount),
            supportingLabel,
            confirmationCode,
            trackingUrl,
            phone,
        });

        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey) {
            fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${resendKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "Care Bridge Kenya <donations@carebridgeke.org>",
                    to: [donor_email.trim().toLowerCase()],
                    subject: `Your Donation to Care Bridge Kenya — ${confirmationCode}`,
                    html: emailHtml,
                }),
            }).catch((e) => console.error("Email send error:", e));
        } else {
            console.warn("RESEND_API_KEY not set — email skipped.");
        }

        // ── Return success ──────────────────────────────────────
        return NextResponse.json({
            success: true,
            confirmation_code: confirmationCode,
            donation_id: donation.id,
            amount: Number(amount),
            currency,
            supporting: supportingLabel,
            donor_email: donor_email.trim().toLowerCase(),
            donor_phone: phone,
            donor_name: is_anonymous ? null : (donor_name?.trim() || null),
        });

    } catch (err) {
        console.error("Manual donation error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

// ─── GET /api/donations/manual?id=… ──────────────────────────────
// Used by admin to fetch a single donation
export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    const code = req.nextUrl.searchParams.get("code");

    if (!id && !code) {
        return NextResponse.json({ error: "Provide id or code" }, { status: 400 });
    }

    const query = supabaseAdmin.from("donations").select("*");
    const { data, error } = id
        ? await query.eq("id", id).single()
        : await query.eq("confirmation_code", code!.trim().toUpperCase()).single();

    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ donation: data });
}

// ─── Email Template ────────────────────────────────────────────────
function buildConfirmationEmail({
    displayName,
    formattedAmount,
    amount,
    supportingLabel,
    confirmationCode,
    trackingUrl,
    phone,
}: {
    displayName: string;
    formattedAmount: string;
    amount: number;
    supportingLabel: string;
    confirmationCode: string;
    trackingUrl: string;
    phone: string;
}) {
    const paybillNo = "123456";
    const tillNo = "654321";
    const whatsapp = "+254 700 000 000";
    const supportEmail = "donations@carebridgeke.org";

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Donation Instructions — Care Bridge Kenya</title></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f6f9fc;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f9fc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:36px 40px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:26px;letter-spacing:-0.5px;">Care Bridge Kenya</h1>
            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Building Bridges of Hope</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 8px;">Thank you, ${displayName}! 🙏</h2>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 28px;">
              We've received your donation request. Please complete the M-Pesa payment using the instructions below.
            </p>

            <!-- Confirmation Code -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:12px;border:2px solid #16a34a;margin-bottom:28px;">
              <tr><td style="padding:22px 28px;text-align:center;">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#16a34a;">Your Confirmation Code</p>
                <p style="margin:0 0 12px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:4px;font-family:monospace;">${confirmationCode}</p>
                <p style="margin:0;font-size:13px;color:#555;">Save this code to track your donation at any time — no account needed.</p>
              </td></tr>
            </table>

            <!-- Donation Details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:28px;">
              <tr><td style="padding:22px 28px;">
                <p style="margin:0 0 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Donation Details</p>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color:#555;font-size:14px;border-bottom:1px solid #e2e8f0;">Amount</td>
                    <td align="right" style="font-size:20px;font-weight:800;color:#16a34a;font-family:monospace;border-bottom:1px solid #e2e8f0;">${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="color:#555;font-size:14px;border-bottom:1px solid #e2e8f0;">Supporting</td>
                    <td align="right" style="font-size:14px;font-weight:600;color:#1a1a1a;border-bottom:1px solid #e2e8f0;">${supportingLabel}</td>
                  </tr>
                  <tr>
                    <td style="color:#555;font-size:14px;border-bottom:1px solid #e2e8f0;">Date</td>
                    <td align="right" style="font-size:13px;color:#555;border-bottom:1px solid #e2e8f0;">${new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</td>
                  </tr>
                  <tr>
                    <td style="color:#555;font-size:14px;">Phone on File</td>
                    <td align="right" style="font-size:13px;color:#555;">${phone}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Payment Instructions -->
            <h2 style="color:#1a1a1a;font-size:18px;margin:0 0 16px;">How to Complete Your Donation</h2>

            <!-- Notice -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border-radius:10px;border:1px solid #fbbf24;margin-bottom:20px;">
              <tr><td style="padding:14px 18px;">
                <p style="margin:0;font-size:13px;color:#92400e;">
                  ⚠️ <strong>Note:</strong> Our M-Pesa numbers are being finalised. If the numbers below don't work, reply to this email and we will send you the current details within the hour.
                </p>
              </td></tr>
            </table>

            <!-- Option 1: Paybill -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:16px;">
              <tr>
                <td style="background:#16a34a;padding:12px 20px;border-radius:12px 12px 0 0;">
                  <p style="margin:0;color:#fff;font-weight:700;font-size:14px;">📱 Option 1: Paybill (Recommended)</p>
                </td>
              </tr>
              <tr><td style="padding:20px;">
                <table width="100%" cellpadding="5" cellspacing="0">
                  ${["Go to M-Pesa menu", "Select <strong>Lipa na M-Pesa</strong>", "Select <strong>Paybill</strong>", `Business Number: <strong style="font-family:monospace;font-size:16px;">${paybillNo}</strong>`, `Account Number: <strong style="font-family:monospace;font-size:16px;">${confirmationCode}</strong>`, `Amount: <strong style="font-family:monospace;font-size:16px;">${amount}</strong>`, "Enter your M-Pesa PIN", "Confirm payment"].map((step, i) => `
                  <tr>
                    <td width="28" valign="top" style="padding-right:10px;">
                      <div style="width:22px;height:22px;background:#16a34a;border-radius:50%;color:#fff;font-size:11px;font-weight:800;text-align:center;line-height:22px;">${i + 1}</div>
                    </td>
                    <td style="font-size:14px;color:#374151;">${step}</td>
                  </tr>`).join("")}
                </table>
              </td></tr>
            </table>

            <!-- Option 2: Till -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:28px;">
              <tr>
                <td style="background:#0891b2;padding:12px 20px;border-radius:12px 12px 0 0;">
                  <p style="margin:0;color:#fff;font-weight:700;font-size:14px;">📱 Option 2: Buy Goods (Till Number)</p>
                </td>
              </tr>
              <tr><td style="padding:20px;">
                <table width="100%" cellpadding="5" cellspacing="0">
                  ${["Go to M-Pesa menu", "Select <strong>Lipa na M-Pesa</strong>", "Select <strong>Buy Goods and Services</strong>", `Till Number: <strong style="font-family:monospace;font-size:16px;">${tillNo}</strong>`, `Amount: <strong style="font-family:monospace;font-size:16px;">${amount}</strong>`, "Enter your M-Pesa PIN", "Confirm payment"].map((step, i) => `
                  <tr>
                    <td width="28" valign="top" style="padding-right:10px;">
                      <div style="width:22px;height:22px;background:#0891b2;border-radius:50%;color:#fff;font-size:11px;font-weight:800;text-align:center;line-height:22px;">${i + 1}</div>
                    </td>
                    <td style="font-size:14px;color:#374151;">${step}</td>
                  </tr>`).join("")}
                </table>
                <p style="margin:16px 0 0;font-size:13px;color:#7c3aed;background:#f5f3ff;padding:12px;border-radius:8px;">
                  <strong>After paying via Till:</strong> Please forward your M-Pesa confirmation SMS to us on WhatsApp: <strong>${whatsapp}</strong> with your code <strong>${confirmationCode}</strong>.
                </p>
              </td></tr>
            </table>

            <!-- What Happens Next -->
            <h2 style="color:#1a1a1a;font-size:16px;margin:0 0 14px;">What Happens Next</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              ${[
            ["📧", "NOW", "This email is your receipt. Keep it safe."],
            ["💳", "YOU — Complete M-Pesa", "Use the instructions above to send your donation."],
            ["✅", "WITHIN 24 HOURS", "We verify your payment and send an official receipt."],
            ["📊", "ONGOING", "You'll receive project updates by email."],
        ].map(([icon, when, desc]) => `
              <tr>
                <td width="36" valign="top" style="padding:6px 12px 6px 0;font-size:22px;">${icon}</td>
                <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;">
                  <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;color:#16a34a;">${when}</p>
                  <p style="margin:2px 0 0;font-size:14px;color:#555;">${desc}</p>
                </td>
              </tr>`).join("")}
            </table>

            <!-- Track Button -->
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${trackingUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:700;font-size:15px;">Track Your Donation →</a>
            </div>

            <!-- Help -->
            <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;border-top:1px solid #e2e8f0;padding-top:22px;">
              Questions? Email us at <a href="mailto:${supportEmail}" style="color:#16a34a;">${supportEmail}</a> or WhatsApp us at <strong>${whatsapp}</strong>.
              You will receive project updates at this address. To unsubscribe, reply with "unsubscribe".
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} Care Bridge Kenya · Nairobi, Kenya</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { to, donor_name, amount, currency = "KES", campaign_title, campaign_slug, payment_ref } = await req.json();

        if (!to || !amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const resendKey = process.env.RESEND_API_KEY;
        if (!resendKey) {
            console.warn("RESEND_API_KEY not set — skipping email");
            return NextResponse.json({ skipped: true });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const formattedAmount = new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
        }).format(amount);

        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Donation Receipt</title></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #f6f9fc; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f9fc; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.5px;">Care Bridge Kenya</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Making a difference, together</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding: 48px 40px;">
            <h2 style="color: #1a1a1a; font-size: 22px; margin: 0 0 8px;">Thank you, ${donor_name || "generous donor"}! 🙏</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">Your donation has been received and confirmed. You're making a real difference in someone's life.</p>
            
            <!-- Receipt Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4; border-radius:12px; border: 1px solid #bbf7d0; margin-bottom: 32px;">
              <tr><td style="padding: 24px 28px;">
                <p style="margin: 0 0 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #16a34a;">Donation Receipt</p>
                <table width="100%" cellpadding="6" cellspacing="0">
                  <tr>
                    <td style="color: #555; font-size: 14px;">Amount Donated</td>
                    <td align="right" style="font-size: 20px; font-weight: 800; color: #16a34a; font-family: monospace;">${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="color: #555; font-size: 14px;">Campaign</td>
                    <td align="right" style="font-size: 14px; font-weight: 600; color: #1a1a1a;">${campaign_title || "—"}</td>
                  </tr>
                  ${payment_ref ? `<tr>
                    <td style="color: #555; font-size: 14px;">Reference</td>
                    <td align="right" style="font-size: 12px; font-family: monospace; color: #888;">${payment_ref}</td>
                  </tr>` : ""}
                </table>
              </td></tr>
            </table>

            ${campaign_slug ? `
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${appUrl}/campaign/${campaign_slug}" style="display:inline-block; background:#16a34a; color:#fff; text-decoration:none; padding:14px 32px; border-radius:50px; font-weight:700; font-size:15px;">View Campaign Progress →</a>
            </div>` : ""}

            <p style="color: #888; font-size: 13px; line-height: 1.6; margin:0; border-top: 1px solid #eee; padding-top: 24px;">
              This is your official donation receipt from Care Bridge Kenya. Questions? Reply to this email or contact us at support@carebridgekenya.com
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f6f9fc; padding: 24px 40px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Care Bridge Kenya · Nairobi, Kenya</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "Care Bridge Kenya <no-reply@carebridgekenya.com>",
                to: [to],
                subject: `✅ Your donation of ${formattedAmount} is confirmed – Care Bridge Kenya`,
                html,
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            console.error("Resend error:", err);
            return NextResponse.json({ error: "Email send failed" }, { status: 500 });
        }

        return NextResponse.json({ sent: true });
    } catch (err) {
        console.error("Email receipt error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

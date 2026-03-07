import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service-role key — this runs server-side only, never in browser
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Generates a unique human-readable tracking code: CBK-YYYYMMDD-XXXX */
function generateConfirmationCode(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const random = Math.random().toString(36).toUpperCase().slice(2, 6).padEnd(4, "0");
    return `CBK-${dateStr}-${random}`;
}

export async function POST(req: NextRequest) {
    // 1. Verify the webhook signature
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers.get("verif-hash");

    if (!secretHash || signature !== secretHash) {
        console.error("Invalid Flutterwave webhook signature");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const payload = await req.json();
        const { event, data } = payload;

        // Only process successful charge events
        if (event !== "charge.completed") {
            return NextResponse.json({ received: true });
        }

        const tx_ref: string = data?.tx_ref ?? "";
        const status: string = data?.status ?? "";

        // Extract our donation ID from the tx_ref (format: CBK-{uuid})
        const donationId = tx_ref.replace("CBK-", "");
        if (!donationId) {
            return NextResponse.json({ error: "Invalid tx_ref" }, { status: 400 });
        }

        if (status === "successful") {
            // 2. Verify the transaction with Flutterwave to prevent replay attacks
            const verifyRes = await fetch(
                `https://api.flutterwave.com/v3/transactions/${data.id}/verify`,
                { headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` } }
            );
            const verifyData = await verifyRes.json();

            if (
                verifyData.status !== "success" ||
                verifyData.data.status !== "successful" ||
                verifyData.data.tx_ref !== tx_ref
            ) {
                console.error("Flutterwave verification failed:", verifyData);
                await supabaseAdmin
                    .from("donations")
                    .update({ status: "failed", payment_ref: String(data.id) })
                    .eq("id", donationId);
                return NextResponse.json({ received: true });
            }

            // 3. Generate a unique CBK confirmation code (retry on collision)
            let confirmationCode = generateConfirmationCode();
            for (let attempt = 0; attempt < 5; attempt++) {
                const { data: existing } = await supabaseAdmin
                    .from("donations")
                    .select("id")
                    .eq("confirmation_code", confirmationCode)
                    .maybeSingle();
                if (!existing) break;
                confirmationCode = generateConfirmationCode();
            }

            // 4. Mark donation confirmed + store tracking code
            const { data: donation, error } = await supabaseAdmin
                .from("donations")
                .update({
                    status: "confirmed",
                    payment_ref: String(data.id),
                    confirmation_code: confirmationCode,
                    fund_status: "pending",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", donationId)
                .select("*, campaign:campaigns(id, title, slug, category, creator_id)")
                .single();

            if (error || !donation) {
                console.error("Donation update error:", error);
                return NextResponse.json({ error: "DB update failed" }, { status: 500 });
            }

            // 5. Increment campaign current_amount
            await Promise.resolve(supabaseAdmin.rpc("increment_campaign_amount", {
                campaign_id: donation.campaign_id,
                amount: donation.amount,
            })).catch(console.error);

            // 6. Send email receipt with tracking code (fire-and-forget)
            if (donation.donor_email) {
                fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/receipt`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: donation.donor_email,
                        donor_name: donation.donor_name,
                        amount: donation.amount,
                        currency: donation.currency,
                        campaign_title: donation.campaign?.title,
                        campaign_slug: donation.campaign?.slug,
                        payment_ref: donation.payment_ref,
                        confirmation_code: confirmationCode,
                    }),
                }).catch(console.error);
            }

        } else {
            // Payment failed or was cancelled
            await supabaseAdmin
                .from("donations")
                .update({ status: "failed", payment_ref: String(data.id ?? "") })
                .eq("id", donationId);
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("Webhook processing error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service-role key — this runs server-side only, never in browser
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

        // Verify the transaction with Flutterwave to prevent replay attacks
        if (status === "successful") {
            const verifyRes = await fetch(
                `https://api.flutterwave.com/v3/transactions/${data.id}/verify`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                    },
                }
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

            // 2. Mark donation as confirmed
            const { data: donation, error } = await supabaseAdmin
                .from("donations")
                .update({
                    status: "confirmed",
                    payment_ref: String(data.id),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", donationId)
                .select("*, campaign:campaigns(id, title, slug, creator_id)")
                .single();

            if (error || !donation) {
                console.error("Donation update error:", error);
                return NextResponse.json({ error: "DB update failed" }, { status: 500 });
            }

            // 3. Send email receipt (fire-and-forget)
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

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { campaign_id, campaign_slug, amount, currency = "KES", donor_name, donor_email, donor_phone, message, is_anonymous, payment_method } = body;

        if (!campaign_id || !amount || amount < 50) {
            return NextResponse.json({ error: "Invalid donation data" }, { status: 400 });
        }

        // Build Supabase client (server-side, using cookies for user session)
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    },
                },
            }
        );

        // Get the current user (optional — anonymous donations are allowed)
        const { data: { user } } = await supabase.auth.getUser();

        // Create a pending donation row
        const { data: donation, error: donationError } = await supabase
            .from("donations")
            .insert({
                campaign_id,
                donor_id: user?.id ?? null,
                donor_name: is_anonymous ? "Anonymous" : (donor_name || null),
                donor_email: donor_email || null,
                amount,
                currency,
                payment_method: payment_method === "mpesa" ? "mpesa" : "card",
                is_anonymous: is_anonymous ?? false,
                message: message || null,
                status: "pending",
            })
            .select()
            .single();

        if (donationError || !donation) {
            console.error("Donation insert error:", donationError);
            return NextResponse.json({ error: "Failed to create donation" }, { status: 500 });
        }

        // Call Flutterwave Standard Payments API
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const flwPayload = {
            tx_ref: `UBK-${donation.id}`,
            amount: Number(amount),
            currency,
            redirect_url: `${appUrl}/donate/success?tx_ref=UBK-${donation.id}`,
            customer: {
                email: donor_email || "donor@unitybridgeke.org",
                phone_number: donor_phone || "",
                name: is_anonymous ? "Anonymous Donor" : (donor_name || "Donor"),
            },
            customizations: {
                title: "Unity Bridge Kenya",
                description: `Donation to campaign`,
                logo: `${appUrl}/logo.png`,
            },
            payment_options: payment_method === "mpesa" ? "mpesa" : "card,mpesa",
            meta: {
                donation_id: donation.id,
                campaign_id,
                campaign_slug,
            },
        };

        const flwRes = await fetch("https://api.flutterwave.com/v3/payments", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.FLW_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(flwPayload),
        });

        const flwData = await flwRes.json();

        if (!flwRes.ok || flwData.status !== "success") {
            console.error("Flutterwave error:", flwData);
            // Clean up the pending donation on FLW failure
            await supabase.from("donations").delete().eq("id", donation.id);
            return NextResponse.json({ error: flwData.message || "Payment gateway error" }, { status: 502 });
        }

        return NextResponse.json({
            payment_link: flwData.data.link,
            donation_id: donation.id,
        });
    } catch (err) {
        console.error("Initiate payment error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

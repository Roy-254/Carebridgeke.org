import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SHORTCODE = process.env.MPESA_SHORTCODE; // Paybill or Till
const PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL; // Public URL of your site

/**
 * Generates Safaricom Access Token
 */
async function getAccessToken() {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
    const res = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        headers: { Authorization: `Basic ${auth}` },
    });
    const data = await res.json();
    return data.access_token;
}

/**
 * Triggers STK Push (Lipa na M-Pesa Online)
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            phone, 
            amount, 
            reference, 
            campaignId, 
            donorName, 
            donorEmail, 
            donorId, 
            isAnonymous, 
            message 
        } = body;

        // 1. Format phone (must be 254...)
        const formattedPhone = "254" + phone.replace(/\D/g, "").slice(-9);

        // 2. Get Token
        const token = await getAccessToken();

        // 3. Prepare LNM Express parameters
        const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
        const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

        const payload = {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline", // or 'CustomerBuyGoodsOnline' for Till
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: CALLBACK_URL,
            AccountReference: reference || "CareBridgeDonation",
            TransactionDesc: "Care Bridge Kenya Donation",
        };

        const res = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.ResponseCode === "0") {
            // 4. Save pending donation to Supabase
            const supabase = await createClient();

            const { error: dbError } = await supabase.from("donations").insert({
                campaign_id: campaignId,
                donor_id: donorId || null,
                donor_name: donorName || "Anonymous",
                donor_email: donorEmail || "anonymous@example.com",
                amount: amount,
                payment_method: "mpesa",
                mpesa_checkout_id: data.CheckoutRequestID,
                status: "pending",
                is_anonymous: isAnonymous || false,
                message: message || "",
            });

            if (dbError) {
                console.error("Database error saving pending donation:", dbError);
                // We still return success to the user because STK push was triggered
            }

            return NextResponse.json({ success: true, checkoutID: data.CheckoutRequestID });
        } else {
            return NextResponse.json({ success: false, error: data.CustomerMessage || "Failed to trigger STK Push" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("STK Push error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

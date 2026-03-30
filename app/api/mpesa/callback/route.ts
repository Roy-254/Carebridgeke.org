import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles Safaricom Callback for STK Push
 * This is hit by Safaricom when the user enters their PIN and the payment is processed.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Check if the response matches Safaricom's structure
        if (!body.Body || !body.Body.stkCallback) {
            return NextResponse.json({ error: "Invalid callback structure" }, { status: 400 });
        }

        const callback = body.Body.stkCallback;
        const result = callback.ResultCode;
        const checkoutID = callback.CheckoutRequestID;

        // ResultCode 0 = Success
        if (result === 0) {
            const items = callback.CallbackMetadata.Item;
            const amount = items.find((i: any) => i.Name === "Amount")?.Value;
            const receipt = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
            const phone = items.find((i: any) => i.Name === "PhoneNumber")?.Value;

            console.log(`✅ Payment SUCCESS: ${checkoutID} (Receipt: ${receipt})`);

            // Update donation status in Supabase
            const supabase = await createClient();
            const { error: dbError } = await supabase
                .from("donations")
                .update({ 
                    status: "confirmed", 
                    payment_ref: receipt,
                    updated_at: new Date().toISOString() 
                })
                .eq("mpesa_checkout_id", checkoutID);

            if (dbError) {
                console.error("Database error updating donation:", dbError);
            }

            return NextResponse.json({ success: true, message: "Callback received and processed" });
        } else {
            // ResultCode !== 0 (Failed/Cancelled)
            console.log(`❌ Payment FAILED/CANCELLED: ${checkoutID} (ResultCode: ${result})`);
            
            // Mark as failed in DB
            const supabase = await createClient();
            await supabase
                .from("donations")
                .update({ status: "failed" })
                .eq("mpesa_checkout_id", checkoutID);

            return NextResponse.json({ success: false, message: "Payment failed/cancelled" });
        }
    } catch (error) {
        console.error("M-Pesa Callback error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

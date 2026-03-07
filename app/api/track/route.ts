import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
        return NextResponse.json({ error: "Missing confirmation code" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: donation, error } = await supabase
        .from("donations")
        .select(`
            id,
            confirmation_code,
            donor_name,
            amount,
            currency,
            created_at,
            status,
            fund_status,
            message,
            is_anonymous,
            campaign:campaigns (
                id,
                title,
                slug,
                category,
                current_amount,
                target_amount,
                story,
                images:campaign_images (storage_url, order_index),
                updates:campaign_updates (id, title, content, created_at)
            )
        `)
        .eq("confirmation_code", code)
        .eq("status", "confirmed")
        .maybeSingle();

    if (error) {
        console.error("Track lookup error:", error);
        return NextResponse.json({ error: "Error looking up donation" }, { status: 500 });
    }

    if (!donation) {
        return NextResponse.json({ error: "No confirmed donation found for this code" }, { status: 404 });
    }

    // Strip private donor info if anonymous
    if (donation.is_anonymous) {
        donation.donor_name = "Anonymous Donor";
    }

    return NextResponse.json({ donation });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();

    // Live aggregate from the donations + campaigns tables
    const { data: stats, error: statsError } = await supabase.rpc("get_transparency_overview");

    if (statsError) {
        console.error("Transparency overview error:", statsError);
    }

    // Recent confirmed donations (public, sanitised)
    const { data: recentDonations } = await supabase
        .from("donations")
        .select("id, donor_name, amount, currency, created_at, is_anonymous, campaign:campaigns(title, slug)")
        .eq("status", "confirmed")
        .order("created_at", { ascending: false })
        .limit(10);

    // Recent project updates showing progress
    const { data: recentUpdates } = await supabase
        .from("project_updates")
        .select("id, title, content, photo_url, created_at, campaign:campaigns(title, slug, category)")
        .order("created_at", { ascending: false })
        .limit(6);

    // Active campaigns (for category breakdown list)
    const { data: activeCampaigns } = await supabase
        .from("campaigns")
        .select("id, title, slug, category, current_amount, target_amount, images:campaign_images(storage_url, order_index)")
        .eq("status", "active")
        .order("current_amount", { ascending: false })
        .limit(6);

    return NextResponse.json({
        stats: stats ?? {
            total_raised: 0,
            donor_count: 0,
            projects_funded: 0,
            this_month_raised: 0,
            school_fees_total: 0,
            medical_total: 0,
            emergency_total: 0,
            community_total: 0,
        },
        recentDonations: (recentDonations ?? []).map((d: any) => ({
            ...d,
            donor_name: d.is_anonymous ? "Anonymous" : d.donor_name,
        })),
        recentUpdates: recentUpdates ?? [],
        activeCampaigns: activeCampaigns ?? [],
    });
}

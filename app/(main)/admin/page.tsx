// Admin Dashboard — protected, only for users with admin role
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AdminDashboardClient } from "@/components/dashboard/admin-dashboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard — Unity Bridge Kenya",
};

export default async function AdminDashboardPage() {
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/sign-in?next=/admin");

    // Check admin role in profiles table
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        redirect("/");
    }

    // Fetch all campaigns with creator info
    const { data: rawCampaigns } = await supabase
        .from("campaigns")
        .select(`
            id, title, slug, category, status, target_amount, current_amount,
            created_at, is_verified,
            creator:profiles!creator_id(id, full_name, is_verified)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

    // Normalize creator from array (Supabase join quirk) to single object
    const campaigns = (rawCampaigns ?? []).map((c: any) => ({
        ...c,
        creator: Array.isArray(c.creator) ? c.creator[0] ?? null : c.creator,
    }));

    // Platform stats
    const { count: totalCampaigns } = await supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true });

    const { count: totalDonations } = await supabase
        .from("donations")
        .select("*", { count: "exact", head: true })
        .eq("status", "confirmed");

    const { data: revenueData } = await supabase
        .from("donations")
        .select("amount")
        .eq("status", "confirmed");

    const totalRevenue = (revenueData ?? []).reduce((s, d) => s + (d.amount ?? 0), 0);

    const { count: pendingCount } = await supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending_review");

    return (
        <AdminDashboardClient
            campaigns={campaigns ?? []}
            stats={{
                totalCampaigns: totalCampaigns ?? 0,
                totalDonations: totalDonations ?? 0,
                totalRevenue,
                pendingReview: pendingCount ?? 0,
            }}
        />
    );
}

// Creator Dashboard — shows the user's own campaigns with stats
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CreatorDashboardClient } from "@/components/dashboard/creator-dashboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Campaigns — Unity Bridge Kenya",
    description: "Manage your fundraising campaigns and track your impact.",
};

export default async function CreatorDashboardPage() {
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
    if (!user) redirect("/auth/sign-in?next=/dashboard/campaigns");

    // Fetch user's campaigns with donation stats
    const { data: campaigns } = await supabase
        .from("campaigns")
        .select(`
            id, title, slug, category, status, target_amount, current_amount,
            deadline, no_deadline, created_at, is_verified,
            images:campaign_images(storage_url, order_index),
            donations:donations(id, amount, status, created_at)
        `)
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, is_verified")
        .eq("id", user.id)
        .single();

    return (
        <CreatorDashboardClient
            campaigns={campaigns ?? []}
            profile={profile ?? { full_name: user.email?.split("@")[0] ?? "Creator", avatar_url: null, is_verified: false }}
        />
    );
}

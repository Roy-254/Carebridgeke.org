/**
 * Supabase Data Access Layer
 * All database queries in one place — server-side only.
 */

import { createClient } from "./server";
import { CampaignFilters } from "@/types";
import { CAMPAIGNS_PER_PAGE } from "@/lib/constants";

// ────────────────────────────────────────────────────────────
//  CAMPAIGNS
// ────────────────────────────────────────────────────────────

export async function getFeaturedCampaigns(limit = 3) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .select(`
            *,
            creator:profiles(id, full_name, avatar_url, is_verified),
            images:campaign_images(storage_url, order_index)
        `)
        .eq("status", "active")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("getFeaturedCampaigns error:", error);
        return [];
    }
    return data ?? [];
}

export async function getCampaigns(filters: CampaignFilters = {}) {
    const supabase = await createClient();
    const {
        category,
        county,
        search,
        sortBy = "recent",
        page = 1,
        pageSize = CAMPAIGNS_PER_PAGE,
    } = filters;

    let query = supabase
        .from("campaigns")
        .select(`
            *,
            creator:profiles(id, full_name, avatar_url, is_verified),
            images:campaign_images(storage_url, order_index)
        `, { count: "exact" })
        .eq("status", "active");

    if (category) query = query.eq("category", category);
    if (county) query = query.eq("county", county);
    if (search) query = query.ilike("title", `%${search}%`);

    switch (sortBy) {
        case "popular": query = query.order("view_count", { ascending: false }); break;
        case "ending_soon": query = query.order("deadline", { ascending: true }); break;
        case "nearly_funded": query = query.order("current_amount", { ascending: false }); break;
        default: query = query.order("created_at", { ascending: false });
    }

    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);

    const { data, error, count } = await query;
    if (error) {
        console.error("getCampaigns error:", error);
        return { campaigns: [], total: 0 };
    }
    return { campaigns: data ?? [], total: count ?? 0 };
}

export async function getCampaignBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .select(`
            *,
            creator:profiles(id, full_name, avatar_url, is_verified, county),
            images:campaign_images(storage_url, order_index),
            documents:campaign_documents(id, file_name, file_size, doc_type),
            updates:campaign_updates(id, title, content, created_at),
            donations(id, donor_name, amount, message, is_anonymous, created_at, status)
        `)
        .eq("slug", slug)
        .eq("status", "active")
        .single();

    if (error) {
        console.error("getCampaignBySlug error:", error);
        return null;
    }

    // Increment view count (fire-and-forget)
    supabase.rpc("increment_view_count", { campaign_slug: slug }).then(() => { });

    return data;
}

export async function getMyCampaigns(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .select(`
            *,
            images:campaign_images(storage_url, order_index)
        `)
        .eq("creator_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("getMyCampaigns error:", error);
        return [];
    }
    return data ?? [];
}

// ────────────────────────────────────────────────────────────
//  PLATFORM STATS
// ────────────────────────────────────────────────────────────

export async function getPlatformStats() {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_platform_stats");
    if (error) {
        console.error("getPlatformStats error:", error);
        return { total_raised: 0, active_campaigns: 0, total_campaigns: 0, lives_impacted: 0 };
    }
    return data as {
        total_raised: number;
        active_campaigns: number;
        total_campaigns: number;
        lives_impacted: number;
    };
}

// ────────────────────────────────────────────────────────────
//  DONATIONS
// ────────────────────────────────────────────────────────────

export async function getDonationsForCampaign(campaignId: string, limit = 10) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("donations")
        .select("id, donor_name, amount, message, is_anonymous, created_at")
        .eq("campaign_id", campaignId)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) return [];
    return data ?? [];
}

export async function getMyDonations(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("donations")
        .select(`
            *,
            campaign:campaigns(id, title, slug, images:campaign_images(storage_url))
        `)
        .eq("donor_id", userId)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false });

    if (error) return [];
    return data ?? [];
}

// ────────────────────────────────────────────────────────────
//  PROFILES
// ────────────────────────────────────────────────────────────

export async function getProfile(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) return null;
    return data;
}

export async function updateProfile(userId: string, updates: Record<string, any>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ────────────────────────────────────────────────────────────
//  NOTIFICATIONS
// ────────────────────────────────────────────────────────────

export async function getNotifications(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

    if (error) return [];
    return data ?? [];
}

export async function markNotificationsRead(userId: string) {
    const supabase = await createClient();
    await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);
}

// ────────────────────────────────────────────────────────────
//  ADMIN QUERIES (use service-role key in Edge Functions)
// ────────────────────────────────────────────────────────────

export async function getPendingCampaigns() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .select(`
            *,
            creator:profiles(id, full_name, avatar_url, phone_number),
            images:campaign_images(storage_url, order_index),
            documents:campaign_documents(id, file_name, file_size, doc_type)
        `)
        .eq("status", "pending_review")
        .order("created_at", { ascending: true });

    if (error) return [];
    return data ?? [];
}

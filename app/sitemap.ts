import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://unitybridgeke.org";

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: appUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
        { url: `${appUrl}/explore`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
        { url: `${appUrl}/campaign/create`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${appUrl}/auth/sign-in`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ];

    // Fetch all active campaign slugs
    let campaignRoutes: MetadataRoute.Sitemap = [];
    try {
        const supabase = await createClient();
        const { data: campaigns } = await supabase
            .from("campaigns")
            .select("slug, updated_at")
            .eq("status", "active")
            .order("updated_at", { ascending: false })
            .limit(500);

        if (campaigns) {
            campaignRoutes = campaigns.map((c) => ({
                url: `${appUrl}/campaign/${c.slug}`,
                lastModified: new Date(c.updated_at),
                changeFrequency: "daily" as const,
                priority: 0.8,
            }));
        }
    } catch {
        // Supabase may not be configured in all environments
    }

    return [...staticRoutes, ...campaignRoutes];
}

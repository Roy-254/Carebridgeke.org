// Donation page — fetches campaign by slug (server component)
import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/supabase/queries";
import { DonateClient } from "@/components/campaign/donate-client";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const campaign = await getCampaignBySlug(slug);
        if (!campaign) return { title: "Campaign Not Found — Unity Bridge Kenya" };
        return {
            title: `${campaign.title} — Unity Bridge Kenya`,
            description: `Support ${campaign.title} and make a real difference.`,
        };
    } catch {
        return { title: "Unity Bridge Kenya" };
    }
}

export default async function DonatePage({ params }: PageProps) {
    const { slug } = await params;

    let campaign: any = null;
    try {
        campaign = await getCampaignBySlug(slug);
    } catch {
        // Supabase not configured
    }

    // Demo fallback for development
    if (!campaign) {
        if (slug === "every-kid-studies" || slug === "clearing-hospital-bills" || slug === "impacting-lives") {
            campaign = DEMO_CAMPAIGNS[slug] ?? DEMO_CAMPAIGNS["every-kid-studies"];
        }
    }

    if (!campaign) notFound();

    return <DonateClient campaign={campaign} />;
}

// ─── Demo campaigns for development (no Supabase required) ───
const DEMO_CAMPAIGNS: Record<string, any> = {
    "every-kid-studies": {
        id: "demo-1",
        title: "Making sure every kid studies",
        slug: "every-kid-studies",
        current_amount: 350000,
        target_amount: 500000,
        images: [{ storage_url: "/school-fees-project.png", order_index: 0 }],
        creator: { full_name: "Unity Bridge Kenya", is_verified: true }
    },
    "clearing-hospital-bills": {
        id: "demo-2",
        title: "Clearing hospital bills",
        slug: "clearing-hospital-bills",
        current_amount: 180000,
        target_amount: 500000,
        images: [{ storage_url: "/medical-relief-project.png", order_index: 0 }],
        creator: { full_name: "Unity Bridge Kenya", is_verified: true }
    },
    "impacting-lives": {
        id: "demo-3",
        title: "Impacting lives of the less privileged",
        slug: "impacting-lives",
        current_amount: 420000,
        target_amount: 600000,
        images: [{ storage_url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200", order_index: 0 }],
        creator: { full_name: "Unity Bridge Kenya", is_verified: true }
    }
};

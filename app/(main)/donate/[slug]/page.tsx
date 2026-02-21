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
        if (!campaign) return { title: "Donate — Care Bridge Kenya" };
        return {
            title: `Donate to ${campaign.title} — Care Bridge Kenya`,
            description: `Support ${campaign.title} and make a real difference.`,
        };
    } catch {
        return { title: "Donate — Care Bridge Kenya" };
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

    if (!campaign) notFound();

    return <DonateClient campaign={campaign} />;
}

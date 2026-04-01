// Server Component — fetches real campaign by slug, returns 404 if not found
import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/supabase/queries";
import { CampaignDetailClient } from "@/components/campaign/campaign-detail-client";
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
            description: campaign.story?.slice(0, 160),
            openGraph: {
                title: campaign.title,
                description: campaign.story?.slice(0, 160),
                images: campaign.images?.[0]?.storage_url ? [campaign.images[0].storage_url] : [],
            },
        };
    } catch {
        return { title: "Unity Bridge Kenya" };
    }
}

export default async function CampaignDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // Try live Supabase data; fall back to a demo campaign for development
    let campaign: any = null;

    try {
        campaign = await getCampaignBySlug(slug);
    } catch {
        // Supabase not configured
    }

    // Demo fallback so you can see the UI without Supabase configured
    if (!campaign) {
        if (slug === "every-kid-studies" || slug === "clearing-hospital-bills" || slug === "impacting-lives") {
            campaign = DEMO_CAMPAIGNS[slug] ?? DEMO_CAMPAIGNS["every-kid-studies"];
        } else {
            notFound();
        }
    }

    return <CampaignDetailClient campaign={campaign} />;
}

// ─── Demo campaigns for development (no Supabase required) ───
const DEMO_CAMPAIGNS: Record<string, any> = {
    "every-kid-studies": {
        id: "demo-1",
        title: "Making sure every kid studies",
        slug: "every-kid-studies",
        category: "school_fees",
        county: "Kenya",
        story: `Education is the most powerful tool we can give a child — but for thousands of Kenyan families, the cost of school fees remains an insurmountable barrier.

At Unity Bridge Kenya, our Education Initiative works to ensure that no child is forced out of the classroom due to financial hardship. We partner with schools, community leaders, and educators across all regions of Kenya to identify students at risk of dropping out, verify their circumstances, and pay their school fees directly to the institution.

From primary school tuition in rural Turkana to secondary examination fees in Nairobi's informal settlements, every donation to this initiative guarantees that a child stays enrolled, stays hopeful, and stays on the path toward their future.

We believe that sustained access to education is the single greatest investment in Kenya's next generation. When you support this initiative, you are not just paying a fee — you are keeping a door open for a child who deserves every chance to succeed.`,
        current_amount: 350000,
        target_amount: 500000,
        deadline: null,
        created_at: "2026-01-15T10:00:00Z",
        view_count: 1250,
        is_verified: false,
        creator: { id: "u1", full_name: "Unity Bridge Kenya", is_verified: false, county: "Nairobi" },
        images: [
            { storage_url: "/school-fees-project.png", order_index: 0 },
        ],
        documents: [],
        updates: [],
        donations: [],
    },
    "clearing-hospital-bills": {
        id: "demo-2",
        title: "Clearing hospital bills",
        slug: "clearing-hospital-bills",
        category: "medical",
        county: "Kenya",
        story: `A medical emergency should not become a financial catastrophe — yet for millions of Kenyans, that is exactly what happens.

Our Medical Relief Initiative at Unity Bridge Kenya focuses on one of the most urgent and often invisible crises in Kenya's healthcare system: patients and families trapped by unpaid hospital bills, unable to be discharged, and facing deteriorating health with no means to cover the cost of their care.

We work directly with hospitals and healthcare facilities across the country to identify those most in need, verify their circumstances, and clear their outstanding bills. From maternity fees for young mothers to surgical costs for accident victims, our support goes straight to the medical institution — transparent, direct, and fully accountable.

Your contribution helps free patients from hospital debt and restores dignity to families at some of the most vulnerable moments of their lives. No one should have to stay sick because they cannot afford to get well.`,
        current_amount: 180000,
        target_amount: 500000,
        deadline: null,
        created_at: "2026-01-20T08:00:00Z",
        view_count: 3200,
        is_verified: false,
        creator: { id: "u2", full_name: "Unity Bridge Kenya", is_verified: false, county: "Nairobi" },
        images: [
            { storage_url: "/medical-relief-project.png", order_index: 0 },
        ],
        documents: [],
        updates: [],
        donations: [],
    },
    "impacting-lives": {
        id: "demo-3",
        title: "Impacting lives of the less privileged",
        slug: "impacting-lives",
        category: "community",
        county: "Kenya",
        story: `Access to clean water, sanitation, and basic community infrastructure remains one of the most pressing challenges facing rural and peri-urban communities across Kenya. Entire households — predominantly women and children — spend hours each day travelling long distances to reach unsafe water sources, sacrificing time, health, and economic opportunity in the process.

Unity Bridge Kenya's Community Development Initiative partners with local leaders, certified engineers, and community committees to fund and install sustainable infrastructure in the areas that need it most. Our approach is community-led: we identify the need, conduct feasibility studies, fund the solution, and establish local management structures to ensure long-term sustainability.

From borehole drilling and pump installation to sanitation upgrades and community resource centres, every project we fund serves hundreds of households and is designed to last for generations. The communities we work with contribute land, local knowledge, and volunteer labour — we contribute the funding that makes it all possible.

Your donation transforms the daily reality of entire villages — giving back time, restoring health, and unlocking opportunity for Kenya's most underserved communities.`,
        current_amount: 420000,
        target_amount: 600000,
        deadline: null,
        created_at: "2026-01-10T07:00:00Z",
        view_count: 5400,
        is_verified: false,
        creator: { id: "u3", full_name: "Unity Bridge Kenya", is_verified: false, county: "Nairobi" },
        images: [
            { storage_url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200", order_index: 0 },
        ],
        documents: [],
        updates: [],
        donations: [],
    },
};


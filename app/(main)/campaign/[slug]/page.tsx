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
        if (!campaign) return { title: "Campaign Not Found — Care Bridge Kenya" };
        return {
            title: `${campaign.title} — Care Bridge Kenya`,
            description: campaign.story?.slice(0, 160),
            openGraph: {
                title: campaign.title,
                description: campaign.story?.slice(0, 160),
                images: campaign.images?.[0]?.storage_url ? [campaign.images[0].storage_url] : [],
            },
        };
    } catch {
        return { title: "Care Bridge Kenya" };
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
        if (slug === "sarah-medical-degree" || slug === "emergency-surgery-baby-john" || slug === "water-well-turkana") {
            campaign = DEMO_CAMPAIGNS[slug] ?? DEMO_CAMPAIGNS["sarah-medical-degree"];
        } else {
            notFound();
        }
    }

    return <CampaignDetailClient campaign={campaign} />;
}

// ─── Demo campaigns for development (no Supabase required) ───
const DEMO_CAMPAIGNS: Record<string, any> = {
    "sarah-medical-degree": {
        id: "demo-1",
        title: "Help Sarah Complete Her Medical Degree",
        slug: "sarah-medical-degree",
        category: "school_fees",
        county: "Nairobi",
        story: `Sarah Wanjiku is a brilliant and dedicated medical student currently in her fourth year at the University of Nairobi. Despite her academic excellence and unwavering commitment to serving the community, she is facing a significant financial hurdle that threatens to halt her dreams of becoming a doctor.

The rising costs of tuition, clinical rotations, and medical equipment have created a deficit of KES 150,000 for her current semester. Sarah has worked multiple part-time jobs and applied for numerous scholarships, but the gap remains.

This campaign aims to raise the remaining tuition balance to ensure Sarah can complete her clinical rotations and finalize her fourth year. Every contribution, whether small or large, will go directly to the University's finance office to cover her arrears.

By supporting Sarah, you are not just helping one student; you are investing in a future healthcare provider who is dedicated to working in underserved rural communities in Kenya.`,
        current_amount: 350000,
        target_amount: 500000,
        deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
        created_at: "2026-01-15T10:00:00Z",
        view_count: 1250,
        is_verified: true,
        creator: { id: "u1", full_name: "Sarah Wanjiku", is_verified: true, avatar_url: "https://i.pravatar.cc/150?u=sarah", county: "Nairobi" },
        images: [
            { storage_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200", order_index: 0 },
            { storage_url: "https://images.unsplash.com/photo-1434031211128-57d6062609fb?w=1200", order_index: 1 },
            { storage_url: "https://images.unsplash.com/photo-1579444507563-79d8b8749f28?w=1200", order_index: 2 },
        ],
        documents: [
            { id: "d1", file_name: "Transcript_Y3.pdf", file_size: 1258291, doc_type: "proof_of_need" },
            { id: "d2", file_name: "University_Fee_Structure.pdf", file_size: 870400, doc_type: "proof_of_need" },
        ],
        updates: [
            { id: "u1", title: "Clinical Rotations Completed!", content: "I'm happy to report that I've successfully completed my surgery rotation thanks to all your support!", created_at: "2026-02-01T09:00:00Z" }
        ],
        donations: [
            { id: "don1", donor_name: "John M.", amount: 5000, message: "Keep going Sarah, we are proud of you!", is_anonymous: false, created_at: new Date(Date.now() - 2 * 3600000).toISOString(), status: "confirmed" },
            { id: "don2", donor_name: null, amount: 1000, message: null, is_anonymous: true, created_at: new Date(Date.now() - 5 * 3600000).toISOString(), status: "confirmed" },
            { id: "don3", donor_name: "Mary O.", amount: 20000, message: "A future doctor for our country!", is_anonymous: false, created_at: new Date(Date.now() - 86400000).toISOString(), status: "confirmed" },
        ],
    },
    "emergency-surgery-baby-john": {
        id: "demo-2",
        title: "Emergency Surgery for Baby John",
        slug: "emergency-surgery-baby-john",
        category: "medical",
        county: "Kisumu",
        story: `Baby John is a 3-month-old infant diagnosed with a congenital heart defect that requires immediate open-heart surgery. His parents, James and Mary Odhiambo, are small-scale farmers from Kisumu who earn less than KES 20,000 per month combined.

The estimated cost of the surgery and post-operative care at Kenyatta National Hospital is KES 250,000. Without this operation within the next two months, doctors have warned that John's condition will deteriorate rapidly.

Your donation will go directly to the hospital account to cover surgery fees, ICU care, and required medications. Every shilling counts — even a small amount brings us closer to giving Baby John a chance to grow up healthy and strong.`,
        current_amount: 180000,
        target_amount: 250000,
        deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
        created_at: "2026-01-20T08:00:00Z",
        view_count: 3200,
        is_verified: true,
        creator: { id: "u2", full_name: "Mary Odhiambo", is_verified: true, avatar_url: "https://i.pravatar.cc/150?u=mary", county: "Kisumu" },
        images: [
            { storage_url: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200", order_index: 0 },
        ],
        documents: [],
        updates: [],
        donations: [
            { id: "don1", donor_name: "Peter K.", amount: 10000, message: "God bless this child", is_anonymous: false, created_at: new Date(Date.now() - 3600000).toISOString(), status: "confirmed" },
            { id: "don2", donor_name: null, amount: 5000, message: null, is_anonymous: true, created_at: new Date(Date.now() - 7200000).toISOString(), status: "confirmed" },
        ],
    },
    "water-well-turkana": {
        id: "demo-3",
        title: "Build a Water Well for Turkana Community",
        slug: "water-well-turkana",
        category: "community",
        county: "Turkana",
        story: `The people of Lokiriama village in Turkana County walk over 8km every day to access the nearest water source. Women and children, who bear this burden, spend 4–6 hours daily on water collection — time that could be spent in school or earning income.

We are partnering with a certified borehole drilling company to sink a 150-meter deep water well that will serve over 500 households. The funds raised will cover drilling, casing, pump installation, and a water kiosk.

The community has already contributed 2 acres of land and volunteer labor. With your help, we can complete this project within 90 days of funding. A sustainable water management committee has been elected and trained to maintain the well for generations.`,
        current_amount: 420000,
        target_amount: 600000,
        deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
        created_at: "2026-01-10T07:00:00Z",
        view_count: 5400,
        is_verified: true,
        creator: { id: "u3", full_name: "Lokiriama Community Leaders", is_verified: true, avatar_url: null, county: "Turkana" },
        images: [
            { storage_url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200", order_index: 0 },
        ],
        documents: [
            { id: "d3", file_name: "Borehole_Quote.pdf", file_size: 920000, doc_type: "proof_of_need" },
        ],
        updates: [],
        donations: [
            { id: "don1", donor_name: "Grace N.", amount: 50000, message: "Water is life!", is_anonymous: false, created_at: new Date(Date.now() - 86400000).toISOString(), status: "confirmed" },
        ],
    },
};

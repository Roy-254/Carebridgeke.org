// Server Component — fetches real data from Supabase, falls back to mock data gracefully
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency, formatCompactNumber, calculatePercentage } from "@/lib/utils";
import {
    Heart, Users, Shield, Zap, Globe,
    GraduationCap, Stethoscope, AlertCircle, Building2,
    ArrowRight, CheckCircle2, Share2, Smartphone
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedCampaigns, getPlatformStats } from "@/lib/supabase/queries";

// ─── Types ──────────────────────────────────────────
interface FeaturedCampaign {
    id: string;
    slug: string;
    title: string;
    category: string;
    county?: string;
    current_amount: number;
    target_amount: number;
    deadline?: string;
    creator?: { full_name: string };
    images?: { storage_url: string; order_index: number }[];
    donations?: { id: string }[];
}

interface PlatformStats {
    total_raised: number;
    active_campaigns: number;
    lives_impacted: number;
}

// ─── Mock Fallback Data ──────────────────────────────
const MOCK_CAMPAIGNS: FeaturedCampaign[] = [
    {
        id: "1",
        slug: "sarah-medical-degree",
        title: "Help Sarah Complete Her Medical Degree",
        category: "school_fees",
        county: "Nairobi",
        current_amount: 350000,
        target_amount: 500000,
        deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
        creator: { full_name: "Sarah Wanjiku" },
        images: [{ storage_url: "/sarah.png", order_index: 0 }],
        donations: Array(45).fill({ id: "x" }),
    },
    {
        id: "2",
        slug: "emergency-surgery-baby-john",
        title: "Emergency Surgery for Baby John",
        category: "medical",
        county: "Kisumu",
        current_amount: 180000,
        target_amount: 250000,
        deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
        creator: { full_name: "Mary Njeri" },
        images: [{ storage_url: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop", order_index: 0 }],
        donations: Array(67).fill({ id: "x" }),
    },
    {
        id: "3",
        slug: "water-well-turkana",
        title: "Build a Water Well for Turkana Community",
        category: "community",
        county: "Turkana",
        current_amount: 420000,
        target_amount: 600000,
        deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
        creator: { full_name: "Turkana Community Leaders" },
        images: [{ storage_url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=600&fit=crop", order_index: 0 }],
        donations: Array(89).fill({ id: "x" }),
    },
];

const MOCK_STATS: PlatformStats = {
    total_raised: 45_000_000,
    active_campaigns: 234,
    lives_impacted: 1250,
};

// ─── Helper ─────────────────────────────────────────
function getDaysLeft(deadline?: string): number | null {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    return diff > 0 ? diff : 0;
}

function getCoverImage(images?: { storage_url: string; order_index: number }[]): string {
    if (!images || images.length === 0) return "/placeholder-campaign.jpg";
    return [...images].sort((a, b) => a.order_index - b.order_index)[0].storage_url;
}

const CATEGORY_COLORS: Record<string, string> = {
    school_fees: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    medical: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    emergency: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    community: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    other: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300",
};

// ────────────────────────────────────────────────────
//  Page Component
// ────────────────────────────────────────────────────

export default async function HomePage() {
    // Try to fetch live data; silently fall back to mock data if Supabase is not configured
    let campaigns: FeaturedCampaign[] = MOCK_CAMPAIGNS;
    let stats: PlatformStats = MOCK_STATS;

    try {
        const [liveStats, liveCampaigns] = await Promise.all([
            getPlatformStats(),
            getFeaturedCampaigns(3),
        ]);
        if (liveCampaigns.length > 0) {
            campaigns = liveCampaigns as unknown as FeaturedCampaign[];
        }
        if (liveStats.total_raised > 0 || liveStats.active_campaigns > 0) {
            stats = liveStats;
        }
    } catch {
        // Supabase not configured yet — mock data shows instead
    }

    const categories = [
        { name: "School Fees", slug: "school_fees", icon: GraduationCap, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
        { name: "Medical Bills", slug: "medical", icon: Stethoscope, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
        { name: "Emergency", slug: "emergency", icon: AlertCircle, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
        { name: "Community", slug: "community", icon: Building2, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
    ];

    const howItWorks = [
        { step: 1, title: "Create Your Campaign", description: "Share your story, set your goal, and upload supporting documents for verification.", icon: Heart },
        { step: 2, title: "Share with Community", description: "Spread the word through WhatsApp, Facebook, and other platforms you already use.", icon: Share2 },
        { step: 3, title: "Receive Donations", description: "Accept donations via M-Pesa, cards, or PayPal. Watch your progress in real-time.", icon: Smartphone },
    ];

    const trustFeatures = [
        { icon: Shield, title: "Verified Campaigns", description: "Every campaign is manually reviewed before going live." },
        { icon: Zap, title: "Fast Withdrawals", description: "Receive your funds within 3–5 business days via M-Pesa or bank." },
        { icon: Globe, title: "Transparent Tracking", description: "Every donation is logged and visible to your supporters." },
        { icon: CheckCircle2, title: "Secure Payments", description: "Bank-level encryption for all M-Pesa and card transactions." },
    ];

    return (
        <div className="space-y-0">

            {/* ── Hero ── */}
            <section className="relative bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-primary)] to-[var(--primary-blue)]/10 py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 animate-slide-up">
                            Lifting burdens, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-blue)]">
                                Building futures
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
                            Raise funds for school fees, medical bills, and urgent needs through transparent, trusted crowdfunding built for Kenya.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                            <Link href="/campaign/create">
                                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                                    Start a Campaign
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/explore">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Explore Campaigns
                                </Button>
                            </Link>
                        </div>

                        {/* Live Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
                            {[
                                { value: formatCurrency(stats.total_raised, "KES"), label: "Total Raised" },
                                { value: stats.active_campaigns.toLocaleString(), label: "Active Campaigns" },
                                { value: formatCompactNumber(stats.lives_impacted) + "+", label: "Lives Impacted" },
                                { value: "100%", label: "Verified Campaigns" },
                            ].map(({ value, label }) => (
                                <div key={label} className="bg-[var(--bg-secondary)]/60 backdrop-blur-sm rounded-xl p-4 border border-[var(--border-light)]">
                                    <div className="text-2xl md:text-3xl font-bold text-[var(--primary-green)] font-mono">{value}</div>
                                    <div className="text-xs md:text-sm text-[var(--text-secondary)] mt-1">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Featured Campaigns ── */}
            <section className="py-16 md:py-24 bg-[var(--bg-primary)]">
                <div className="container-custom">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">Featured Campaigns</h2>
                            <p className="text-[var(--text-secondary)]">Real people, real needs — help make a difference today</p>
                        </div>
                        <Link href="/explore">
                            <Button variant="outline">
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {campaigns.map((campaign) => {
                            const pct = calculatePercentage(campaign.current_amount, campaign.target_amount);
                            const daysLeft = getDaysLeft(campaign.deadline);
                            const coverImage = getCoverImage(campaign.images);
                            const donorCount = campaign.donations?.length ?? 0;
                            const categoryColor = CATEGORY_COLORS[campaign.category] ?? CATEGORY_COLORS.other;
                            const categoryLabel = campaign.category.replace("_", " ");

                            return (
                                <Card key={campaign.id} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative h-52 overflow-hidden">
                                        <Image
                                            src={coverImage}
                                            alt={campaign.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized={coverImage.startsWith("https://images.unsplash.com")}
                                        />
                                        {daysLeft !== null && (
                                            <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--text-primary)] shadow">
                                                {daysLeft === 0 ? "Ending today!" : `${daysLeft}d left`}
                                            </div>
                                        )}
                                        {pct >= 100 && (
                                            <div className="absolute top-3 left-3 bg-[var(--primary-green)] text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                                                ✓ Goal Reached
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${categoryColor}`}>
                                                {categoryLabel}
                                            </span>
                                            {campaign.county && (
                                                <span className="text-xs text-[var(--text-muted)]">• {campaign.county}</span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-2 leading-snug">
                                            {campaign.title}
                                        </h3>

                                        <p className="text-sm text-[var(--text-secondary)]">
                                            by {campaign.creator?.full_name ?? "Anonymous"}
                                        </p>

                                        {/* Progress */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-semibold text-[var(--text-muted)]">
                                                <span className="text-[var(--primary-green)]">{pct}% funded</span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {donorCount} donors
                                                </span>
                                            </div>
                                            <ProgressBar current={campaign.current_amount} target={campaign.target_amount} />
                                        </div>

                                        <Link href={`/campaign/${campaign.slug}`}>
                                            <Button variant="primary" className="w-full mt-1">
                                                See More
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Categories ── */}
            <section className="py-16 md:py-24 bg-[var(--bg-secondary)]">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Browse by Category</h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Find campaigns that matter to you</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <Link key={cat.slug} href={`/explore?category=${cat.slug}`}>
                                <Card className="text-center cursor-pointer group hover:shadow-lg transition-all duration-200">
                                    <CardContent className="p-8">
                                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${cat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <cat.icon className={`w-8 h-8 ${cat.color}`} />
                                        </div>
                                        <h3 className="font-bold text-[var(--text-primary)] mb-1">{cat.name}</h3>
                                        <p className="text-xs text-[var(--text-muted)]">Browse campaigns</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" className="py-16 md:py-24 bg-[var(--bg-primary)]">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">How It Works</h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Start fundraising in three simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {howItWorks.map((item) => (
                            <div key={item.step} className="relative">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-blue)] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{item.title}</h3>
                                    <p className="text-[var(--text-secondary)]">{item.description}</p>
                                </div>
                                {item.step < 3 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-blue)] opacity-30" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/campaign/create">
                            <Button variant="primary" size="lg">
                                Get Started Now
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Trust Features ── */}
            <section id="about" className="py-16 md:py-24 bg-[var(--bg-secondary)]">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Why Trust Care Bridge Kenya?</h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Your security and trust are our top priorities</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trustFeatures.map((feature) => (
                            <Card key={feature.title}>
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--primary-green)]/10 flex items-center justify-center">
                                        <feature.icon className="w-6 h-6 text-[var(--primary-green)]" />
                                    </div>
                                    <h3 className="font-bold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-blue)] text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Join thousands of Kenyans building bridges of hope every day.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/campaign/create">
                            <Button variant="secondary" size="lg" className="bg-white text-[var(--primary-green)] hover:bg-gray-100">
                                Start Your Campaign
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/explore">
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                                Browse Campaigns
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

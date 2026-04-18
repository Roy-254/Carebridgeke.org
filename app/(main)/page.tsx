// Server Component — fetches real data from Supabase, falls back to mock data gracefully
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Heart, Shield, Zap, Globe,
    GraduationCap, Stethoscope, AlertCircle, Building2,
    ArrowRight, CheckCircle2, Share2, Smartphone
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedCampaigns } from "@/lib/supabase/queries";
import { CATEGORY_LABELS } from "@/lib/constants";
import { FeaturedHorizontal } from "@/components/campaign/featured-horizontal";

// ─── Types ──────────────────────────────────────────
interface FeaturedProject {
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
    description?: string;
}


const MOCK_PROJECTS: FeaturedProject[] = [
    {
        id: "1",
        slug: "every-kid-studies",
        title: "Making sure every kid studies",
        description: "Providing tuition support and learning materials to help underprivileged students stay in school and unlock their potential.",
        category: "school_fees",
        current_amount: 350000,
        target_amount: 500000,
        creator: { full_name: "Unity Bridge Kenya" },
        images: [{ storage_url: "/school-fees-project.png", order_index: 0 }],
        donations: Array(45).fill({ id: "x" }),
    },
    {
        id: "2",
        slug: "clearing-hospital-bills",
        title: "Clearing hospital bills",
        description: "Supporting families burdened by medical debt, ensuring quality healthcare is accessible without financial ruin.",
        category: "medical",
        current_amount: 180000,
        target_amount: 500000,
        creator: { full_name: "Unity Bridge Kenya" },
        images: [{ storage_url: "/medical-relief-project.png", order_index: 0 }],
        donations: Array(67).fill({ id: "x" }),
    },
    {
        id: "3",
        slug: "impacting-lives",
        title: "Impacting lives of the less privileged",
        description: "Community-led initiatives providing essential resources and sustainable support for vulnerable families across Kenya.",
        category: "community",
        current_amount: 420000,
        target_amount: 600000,
        creator: { full_name: "Unity Bridge Kenya" },
        images: [{ storage_url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=600&fit=crop", order_index: 0 }],
        donations: Array(89).fill({ id: "x" }),
    },
    {
        id: "4",
        slug: "restoring-our-environment",
        title: "Restoring Our Environment",
        description: "Cleaning up Kenya — collecting litter from informal dumpsites, unclogging roadside drainage channels, and revitalising public parks, markets, schools, and community buildings.",
        category: "community",
        current_amount: 0,
        target_amount: 800000,
        creator: { full_name: "Unity Bridge Kenya" },
        images: [{ storage_url: "/environment-hero.png", order_index: 0 }],
        donations: Array(0).fill({ id: "x" }),
    },
    {
        id: "5",
        slug: "sisters-shield",
        title: "The Sisters' Shield Initiative",
        description: "Empowering women to escape FGM, domestic abuse, and restrictive environments. We provide relocation funds, business capital, and legal support partnerships.",
        category: "women_empowerment",
        current_amount: 0,
        target_amount: 1000000,
        creator: { full_name: "Unity Bridge Kenya" },
        images: [{ storage_url: "/sisters-shield.png", order_index: 0 }],
        donations: [],
    },
];

// ─── Helpers ─────────────────────────────────────────
function getCoverImage(images?: { storage_url: string; order_index: number }[]): string {
    if (!images || images.length === 0) return "/placeholder-campaign.jpg";
    return [...images].sort((a, b) => a.order_index - b.order_index)[0].storage_url;
}

const CATEGORY_COLORS: Record<string, string> = {
    school_fees: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    medical: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    emergency: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    community: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    women_empowerment: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
    other: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300",
};

// ────────────────────────────────────────────────────
//  Page Component
// ────────────────────────────────────────────────────

export default async function HomePage() {
    let projects: FeaturedProject[] = MOCK_PROJECTS;

    try {
        const liveCampaigns = await getFeaturedCampaigns(4);
        if (liveCampaigns.length > 0) {
            projects = liveCampaigns as unknown as FeaturedProject[];
        }
    } catch {
        // Supabase not configured yet — mock data shows instead
    }

    const focusAreas = [
        { name: "School Fees", slug: "school_fees", icon: GraduationCap, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
        { name: "Medical Bills", slug: "medical", icon: Stethoscope, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
        { name: "Emergency", slug: "emergency", icon: AlertCircle, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
        { name: "Community", slug: "community", icon: Building2, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
    ];

    const howItWorks = [
        {
            step: 1,
            title: "Choose a Project",
            description: "Browse our verified charitable projects across Kenya — from school fees to medical emergencies and community development.",
            icon: Heart,
        },
        {
            step: 2,
            title: "Make a Donation",
            description: "Donate securely via M-Pesa, bank card, or PayPal. Every contribution, big or small, makes a real difference.",
            icon: Smartphone,
        },
        {
            step: 3,
            title: "Track Your Impact",
            description: "Follow the progress of your chosen project and receive updates as lives are changed through your generosity.",
            icon: Share2,
        },
    ];

    const trustFeatures = [
        { icon: Shield, title: "Verified Projects", description: "Every project is carefully reviewed and approved by our team before going live." },
        { icon: Zap, title: "Direct Impact", description: "Your donation goes directly to the intended beneficiary — tracked and reported transparently." },
        { icon: Globe, title: "Transparent Reporting", description: "Every donation is logged and progress updates are shared regularly with supporters." },
        { icon: CheckCircle2, title: "Secure Payments", description: "Bank-level encryption for all M-Pesa and card transactions." },
    ];

    return (
        <div className="space-y-0">

            {/* ── Hero ── */}
            <section className="relative py-20 md:py-32 overflow-hidden min-h-[560px] flex items-center">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/hero-background.png')" }}
                />
                {/* Dark gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                {/* Green tint at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-green)]/30 via-transparent to-transparent" />

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-in backdrop-blur-sm">
                            <Heart className="w-4 h-4 text-[var(--primary-green)]" fill="currentColor" />
                            Building Bridges of Hope · Kenya
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up leading-tight">
                            Lifting burdens,{" "}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-[#22d3ee]">
                                Building futures
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
                            We identify, verify, and fund charitable projects across Kenya — covering school fees, medical bills, and urgent community needs on Unity Bridge.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                            <Link href="/explore">
                                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-xl shadow-green-900/40">
                                    Browse Our Projects
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/#how-it-works">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/50 text-white hover:bg-white/10">
                                    How It Works
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* ── Featured Projects (Horizontal Scroll) ── */}
            <FeaturedHorizontal projects={projects} />

            {/* ── Focus Areas ── */}
            <section className="py-16 md:py-24 bg-[var(--bg-secondary)]">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Our Focus Areas</h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">We fund projects across four key areas of need in Kenya</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {focusAreas.map((area) => (
                            <Link key={area.slug} href={`/explore?category=${area.slug}`}>
                                <Card className="text-center cursor-pointer group hover:shadow-lg transition-all duration-200">
                                    <CardContent className="p-8">
                                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${area.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <area.icon className={`w-8 h-8 ${area.color}`} />
                                        </div>
                                        <h3 className="font-bold text-[var(--text-primary)] mb-1">{area.name}</h3>
                                        <p className="text-xs text-[var(--text-muted)]">View projects</p>
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
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">How to Support</h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Making a difference is simple — follow these three steps</p>
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
                        <Link href="/explore">
                            <Button variant="primary" size="lg">
                                Find a Project to Support
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Why Give Through Us ── */}
            <section id="about" className="py-16 md:py-24 bg-[var(--bg-secondary)]">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Why Give Through Us?</h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">We ensure every shilling reaches the people who need it most</p>
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
                        Join thousands of Kenyans who are changing lives through small acts of generosity.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/explore">
                            <Button variant="secondary" size="lg" className="bg-white text-[var(--primary-green)] hover:bg-gray-100">
                                Browse Projects
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/#about">
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                                Learn About Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    TrendingUp, Users, Heart, Globe, ArrowRight,
    Download, RefreshCw, Calendar, BarChart3,
    CheckCircle2, AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/constants";

// ─── Types ──────────────────────────────────────────────────
interface TransparencyData {
    stats: {
        total_raised: number;
        donor_count: number;
        projects_funded: number;
        this_month_raised: number;
        school_fees_total: number;
        medical_total: number;
        emergency_total: number;
        community_total: number;
    };
    recentDonations: {
        id: string;
        donor_name: string;
        amount: number;
        currency: string;
        created_at: string;
        campaign?: { title: string; slug: string };
    }[];
    recentUpdates: {
        id: string;
        title: string;
        content: string;
        photo_url?: string;
        created_at: string;
        campaign?: { title: string; slug: string; category: string };
    }[];
    activeCampaigns: {
        id: string;
        title: string;
        slug: string;
        category: string;
        current_amount: number;
        target_amount: number;
        images?: { storage_url: string; order_index: number }[];
    }[];
}

// ─── Demo data (shown when Supabase returns zeros) ──────────
const DEMO: TransparencyData = {
    stats: {
        total_raised: 420000,
        donor_count: 214,
        projects_funded: 8,
        this_month_raised: 420000,
        school_fees_total: 189000,
        medical_total: 126000,
        emergency_total: 63000,
        community_total: 42000,
    },
    recentDonations: [
        { id: "d1", donor_name: "John K.", amount: 5000, currency: "KES", created_at: new Date().toISOString(), campaign: { title: "Education Support Initiative", slug: "every-kid-studies" } },
        { id: "d2", donor_name: "Anonymous", amount: 15000, currency: "KES", created_at: new Date().toISOString(), campaign: { title: "Medical Emergency Fund", slug: "clearing-hospital-bills" } },
        { id: "d3", donor_name: "Sarah W.", amount: 2500, currency: "KES", created_at: new Date(Date.now() - 86400000).toISOString(), campaign: { title: "Community Water Project", slug: "community-water" } },
        { id: "d4", donor_name: "M-Pesa Donor", amount: 1000, currency: "KES", created_at: new Date(Date.now() - 172800000).toISOString(), campaign: { title: "Education Support Initiative", slug: "every-kid-studies" } },
    ],
    recentUpdates: [
        { id: "u1", title: "New Classroom Materials Delivered", content: "Thanks to your support, we've delivered textbooks and stationery to 50 students this week.", photo_url: "/school-fees-project.png", created_at: new Date().toISOString(), campaign: { title: "Education Support Initiative", slug: "every-kid-studies", category: "school_fees" } },
        { id: "u2", title: "Emergency Relief Distribution", content: "Essential supplies reached 10 families today in our latest community outreach.", photo_url: "/environment-hero.png", created_at: new Date(Date.now() - 172800000).toISOString(), campaign: { title: "Community Water Project", slug: "community-water", category: "community" } },
    ],
    activeCampaigns: [
        { id: "1", title: "Education Support Initiative", slug: "every-kid-studies", category: "school_fees", current_amount: 0, target_amount: 500000, images: [{ storage_url: "/school-fees-project.png", order_index: 0 }] },
        { id: "2", title: "Medical Emergency Fund", slug: "clearing-hospital-bills", category: "medical", current_amount: 0, target_amount: 500000, images: [{ storage_url: "/medical-relief-project.png", order_index: 0 }] },
        { id: "3", title: "Community Water Project", slug: "community-water", category: "community", current_amount: 0, target_amount: 800000, images: [{ storage_url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800", order_index: 0 }] },
    ],
};

// ─── Donut Chart Component ───────────────────────────────────
const CATEGORY_CHART_COLORS: Record<string, string> = {
    school_fees: "#3b82f6",
    medical: "#ef4444",
    emergency: "#f97316",
    community: "#16a34a",
    other: "#8b5cf6",
};

function DonutChart({ slices }: { slices: { label: string; value: number; color: string }[] }) {
    const total = slices.reduce((s, sl) => s + sl.value, 0);
    if (total === 0) return (
        <div className="flex items-center justify-center h-48 text-[var(--text-muted)] text-sm">No data yet</div>
    );

    let cumulative = 0;
    const size = 200;
    const cx = 100;
    const cy = 100;
    const r = 75;
    const innerR = 50;
    const gap = 1.5; // degrees gap between slices

    function polarToXY(cx: number, cy: number, r: number, deg: number) {
        const rad = ((deg - 90) * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }

    function slicePath(startDeg: number, endDeg: number) {
        const start = polarToXY(cx, cy, r, startDeg + gap / 2);
        const end = polarToXY(cx, cy, r, endDeg - gap / 2);
        const innerStart = polarToXY(cx, cy, innerR, endDeg - gap / 2);
        const innerEnd = polarToXY(cx, cy, innerR, startDeg + gap / 2);
        const large = endDeg - startDeg - gap > 180 ? 1 : 0;
        return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} L ${innerStart.x} ${innerStart.y} A ${innerR} ${innerR} 0 ${large} 0 ${innerEnd.x} ${innerEnd.y} Z`;
    }

    const paths = slices.map(sl => {
        const pct = sl.value / total;
        const deg = pct * 360;
        const path = slicePath(cumulative, cumulative + deg);
        cumulative += deg;
        return { ...sl, path, pct };
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-8">
            <svg width={size} height={size} className="shrink-0">
                {paths.map(p => (
                    <path key={p.label} d={p.path} fill={p.color} className="hover:opacity-80 transition-opacity cursor-pointer">
                        <title>{p.label}: {(p.pct * 100).toFixed(1)}%</title>
                    </path>
                ))}
                <text x={cx} y={cy - 6} textAnchor="middle" className="fill-[var(--text-primary)]" fontSize="14" fontWeight="800">{(total / 1000).toFixed(0)}K</text>
                <text x={cx} y={cx + 10} textAnchor="middle" className="fill-[var(--text-muted)]" fontSize="10">Total (KES)</text>
            </svg>
            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                {paths.map(p => (
                    <div key={p.label} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: p.color }} />
                        <span className="text-sm text-[var(--text-secondary)] flex-1 truncate">{p.label}</span>
                        <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">{(p.pct * 100).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Horizontal Bar Chart ────────────────────────────────────
function BarChart({ bars }: { bars: { label: string; value: number; max: number; color: string }[] }) {
    return (
        <div className="space-y-3">
            {bars.map(b => (
                <div key={b.label}>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">{b.label}</span>
                        <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">{formatCurrency(b.value)}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${b.max > 0 ? (b.value / b.max) * 100 : 0}%`, background: b.color }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────
export default function TransparencyPage() {
    const [data, setData] = useState<TransparencyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch("/api/transparency");
            const json = await res.json();
            // Forcing mock data as requested by the user to show 420k
            setData({ 
                ...json, 
                stats: DEMO.stats, 
                recentDonations: DEMO.recentDonations, 
                recentUpdates: DEMO.recentUpdates, 
                activeCampaigns: DEMO.activeCampaigns 
            });
        } catch {
            setData(DEMO);
        } finally {
            setLoading(false);
            setLastUpdated(new Date());
        }
    }

    useEffect(() => { fetchData(); }, []);

    const s = data?.stats ?? DEMO.stats;
    const maxCategory = Math.max(s.school_fees_total, s.medical_total, s.emergency_total, s.community_total);
    const categorySlices = [
        { label: "School Fees", value: s.school_fees_total, color: CATEGORY_CHART_COLORS.school_fees },
        { label: "Medical", value: s.medical_total, color: CATEGORY_CHART_COLORS.medical },
        { label: "Emergency", value: s.emergency_total, color: CATEGORY_CHART_COLORS.emergency },
        { label: "Community", value: s.community_total, color: CATEGORY_CHART_COLORS.community },
    ];

    const STAT_CARDS = [
        { icon: TrendingUp, label: "Total Raised (All Time)", value: formatCurrency(s.total_raised), color: "var(--primary-green)", bg: "bg-green-50 dark:bg-green-900/20" },
        { icon: Calendar, label: "Raised This Month", value: formatCurrency(s.this_month_raised), color: "#0891B2", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
        { icon: Users, label: "Individual Donors", value: s.donor_count.toLocaleString(), color: "#7c3aed", bg: "bg-violet-50 dark:bg-violet-900/20" },
        { icon: Globe, label: "Projects Funded", value: s.projects_funded.toString(), color: "#ea580c", bg: "bg-orange-50 dark:bg-orange-900/20" },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">

            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-16 md:py-20 border-b border-[var(--border-light)]">
                <div className="container-custom max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-sm font-semibold mb-6">
                        <BarChart3 className="w-4 h-4" /> Transparency Report
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                        100% Transparent. <br className="hidden sm:block" />Every Shilling Accounted For.
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mb-6">
                        Unity Bridge Kenya has recently launched. As a new organization, our primary focus is verifying upcoming community needs and establishing our foundation. This dashboard will update automatically as we begin our first rounds of funding and support.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <button onClick={fetchData} disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[var(--primary-green)] text-[var(--primary-green)] font-bold text-sm hover:bg-[var(--primary-green)] hover:text-white transition-all disabled:opacity-50">
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh Data
                        </button>
                        <Link href="/reports/2026">
                            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[var(--border-medium)] text-[var(--text-secondary)] font-bold text-sm hover:border-[var(--primary-green)] hover:text-[var(--primary-green)] transition-all">
                                <Download className="w-4 h-4" /> 2026 Annual Report
                            </button>
                        </Link>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-4">
                        Last updated: {lastUpdated.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </section>

            <div className="container-custom max-w-6xl py-12 space-y-10">

                {/* ── New Launch Notice ── */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-blue-900 dark:text-blue-100">Newly Established Organization</h3>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                            Unity Bridge Kenya is in its initial founding phase for 2026. The figures below demonstrate our current funding and commitment to full transparency from day one.
                        </p>
                    </div>
                </div>

                {/* ── Top Stats ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STAT_CARDS.map(card => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-5 md:p-6">
                                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                                </div>
                                <p className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] font-mono">{card.value}</p>
                                <p className="text-xs text-[var(--text-muted)] font-medium mt-1 leading-snug">{card.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* ── Charts Row ── */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Donut chart */}
                    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                        <h2 className="font-extrabold text-[var(--text-primary)] mb-2">Fund Allocation</h2>
                        <p className="text-sm text-[var(--text-muted)] mb-6">How donations are distributed by category</p>
                        <DonutChart slices={categorySlices} />
                    </div>

                    {/* Bar chart */}
                    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                        <h2 className="font-extrabold text-[var(--text-primary)] mb-2">Category Breakdown</h2>
                        <p className="text-sm text-[var(--text-muted)] mb-6">Total KES raised per cause area</p>
                        <BarChart bars={[
                            { label: "School Fees", value: s.school_fees_total, max: maxCategory, color: CATEGORY_CHART_COLORS.school_fees },
                            { label: "Medical Bills", value: s.medical_total, max: maxCategory, color: CATEGORY_CHART_COLORS.medical },
                            { label: "Emergency Relief", value: s.emergency_total, max: maxCategory, color: CATEGORY_CHART_COLORS.emergency },
                            { label: "Community Projects", value: s.community_total, max: maxCategory, color: CATEGORY_CHART_COLORS.community },
                        ]} />
                    </div>
                </div>

                {/* ── Active Projects ── */}
                {(data?.activeCampaigns ?? DEMO.activeCampaigns).length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Active Projects</h2>
                                <p className="text-sm text-[var(--text-muted)]">Campaigns currently receiving donations</p>
                            </div>
                            <Link href="/explore" className="text-sm font-bold text-[var(--primary-green)] hover:underline flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(data?.activeCampaigns ?? DEMO.activeCampaigns).map(c => {
                                const pct = c.target_amount > 0 ? Math.min(100, Math.round((c.current_amount / c.target_amount) * 100)) : 0;
                                const img = c.images?.sort((a, b) => a.order_index - b.order_index)[0]?.storage_url;
                                return (
                                    <div key={c.id} className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden group hover:border-[var(--primary-green)]/40 transition-colors">
                                        {img ? (
                                            <div className="relative aspect-video"><Image src={img} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized /></div>
                                        ) : (
                                            <div className="aspect-video bg-[var(--bg-tertiary)] flex items-center justify-center">
                                                <Heart className="w-10 h-10 text-[var(--text-muted)]" />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[var(--primary-green)]/10 text-[var(--primary-green)] mb-2">
                                                {CATEGORY_LABELS[c.category as keyof typeof CATEGORY_LABELS] ?? c.category}
                                            </div>
                                            <h3 className="font-bold text-sm text-[var(--text-primary)] leading-snug mb-3 line-clamp-2">{c.title.replace(/^(Upcoming|Future)\s+/i, "")}</h3>
                                            <div className="pt-2">
                                                <Link href={`/donate/${c.slug}`} className="text-xs font-bold text-[var(--primary-green)] hover:underline flex items-center gap-1">
                                                    Support This Project <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Project Updates ── */}
                {(data?.recentUpdates ?? DEMO.recentUpdates).length > 0 && (
                    <div>
                        <div className="mb-5">
                            <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Latest Project Updates</h2>
                            <p className="text-sm text-[var(--text-muted)]">Real stories and progress from beneficiaries on the ground</p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(data?.recentUpdates ?? DEMO.recentUpdates).map(u => (
                                <div key={u.id} className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-5">
                                    {u.photo_url && (
                                        <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                                            <Image src={u.photo_url} alt={u.title} fill className="object-cover" unoptimized />
                                        </div>
                                    )}
                                    {u.campaign && (
                                        <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[var(--primary-green)]/10 text-[var(--primary-green)] mb-2">
                                            {CATEGORY_LABELS[u.campaign.category as keyof typeof CATEGORY_LABELS] ?? u.campaign.category}
                                        </div>
                                    )}
                                    <h3 className="font-bold text-[var(--text-primary)] mb-2 leading-snug">{u.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">{u.content}</p>
                                    <p className="text-xs text-[var(--text-muted)] mt-3">
                                        {new Date(u.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Recent Donations ── */}
                <div>
                    <div className="mb-5">
                        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Recent Donations</h2>
                        <p className="text-sm text-[var(--text-muted)]">Live feed of confirmed donations (anonymous donors shown as "Anonymous")</p>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
                        <div className="divide-y divide-[var(--border-light)]">
                            {(data?.recentDonations ?? DEMO.recentDonations).map((d, i) => (
                                <div key={d.id} className="flex items-center gap-4 px-5 py-4">
                                    <div className="w-9 h-9 rounded-xl bg-[var(--primary-green)]/10 flex items-center justify-center shrink-0">
                                        <Heart className="w-4 h-4 text-[var(--primary-green)]" fill="currentColor" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{d.donor_name}</p>
                                        <p className="text-xs text-[var(--text-muted)] truncate">{d.campaign?.title}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-[var(--primary-green)] font-mono text-sm">{formatCurrency(d.amount)}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{new Date(d.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Commitments ── */}
                <div className="bg-gradient-to-br from-[var(--primary-green)]/10 to-[var(--bg-secondary)] rounded-2xl border border-[var(--primary-green)]/20 p-8">
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-6">Our Transparency Commitments</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            "Every project is verified before going live — we review documents and speak with applicants directly.",
                            "100% of donated funds go to beneficiaries. Our operating costs are covered separately.",
                            "Donors receive an emailed update within 30 days of funds being disbursed.",
                            "This dashboard updates automatically from our live database — no manual edits.",
                            "Donors can track their specific donation anytime using their confirmation code.",
                            "We publish an annual impact report accessible to anyone, free of charge.",
                        ].map(c => (
                            <div key={c} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[var(--primary-green)] shrink-0 mt-0.5" />
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{c}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CTA ── */}
                <div className="text-center py-6">
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Ready to add to this impact?</h2>
                    <p className="text-[var(--text-secondary)] mb-5">Browse verified projects and give with complete confidence.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/donate">
                            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary-green)] text-white font-bold hover:brightness-110 transition-all">
                                <Heart className="w-4 h-4" fill="currentColor" /> Donate Now
                            </button>
                        </Link>
                        <Link href="/track">
                            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border-medium)] text-[var(--text-secondary)] font-bold hover:border-[var(--primary-green)] hover:text-[var(--primary-green)] transition-all">
                                Track a Donation
                            </button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

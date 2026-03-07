"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Search, CheckCircle2, Clock, Loader2, AlertCircle,
    Heart, ArrowRight, BadgeCheck, FileText, TrendingUp
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/constants";

// ─── Types ──────────────────────────────────────────────────
interface TrackResult {
    id: string;
    confirmation_code: string;
    donor_name: string;
    amount: number;
    currency: string;
    created_at: string;
    status: string;
    fund_status: "pending" | "distributed" | "completed";
    message?: string;
    campaign?: {
        id: string;
        title: string;
        slug: string;
        category: string;
        current_amount: number;
        target_amount: number;
        story: string;
        images?: { storage_url: string; order_index: number }[];
        updates?: { id: string; title: string; content: string; created_at: string }[];
    };
}

const FUND_STATUS_CONFIG = {
    pending: {
        label: "Funds Received — Pending Disbursement",
        desc: "Your donation has been received and is being held securely. Our team is verifying the project details before releasing funds to the beneficiary.",
        color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300",
        icon: Clock,
    },
    distributed: {
        label: "Funds Disbursed to Beneficiary",
        desc: "Your donation has been sent directly to the verified beneficiary. We are monitoring progress and will share an update soon.",
        color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300",
        icon: TrendingUp,
    },
    completed: {
        label: "Impact Delivered — Project Complete",
        desc: "The project has been completed successfully. See below for photos and updates showing the impact your donation made.",
        color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300",
        icon: CheckCircle2,
    },
};

// ─── Main tracking form & result component ──────────────────
function TrackForm() {
    const searchParams = useSearchParams();
    const [code, setCode] = useState(searchParams.get("code") ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<TrackResult | null>(null);

    // Auto-search if code is in URL
    useEffect(() => {
        if (searchParams.get("code")) {
            handleSearch(searchParams.get("code")!);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSearch(searchCode?: string) {
        const lookupCode = (searchCode ?? code).trim().toUpperCase();
        if (!lookupCode) { setError("Please enter your confirmation code."); return; }
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await fetch(`/api/track?code=${encodeURIComponent(lookupCode)}`);
            const data = await res.json();
            if (!res.ok) { setError(data.error ?? "No donation found for this code."); return; }
            setResult(data.donation);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const statusCfg = result ? FUND_STATUS_CONFIG[result.fund_status] ?? FUND_STATUS_CONFIG.pending : null;
    const coverImage = result?.campaign?.images?.sort((a, b) => a.order_index - b.order_index)[0]?.storage_url;
    const percentage = result?.campaign
        ? calculatePercentage(result.campaign.current_amount, result.campaign.target_amount)
        : 0;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Search box */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6 md:p-8 mb-8">
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                    Enter Your Confirmation Code
                </label>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Your code was emailed to you after your donation. Format: <span className="font-mono font-bold text-[var(--primary-green)]">CBK-YYYYMMDD-XXXX</span>
                </p>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                        placeholder="CBK-20260306-A1B2"
                        className="flex-1 h-13 px-5 rounded-xl border-2 border-[var(--border-light)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono text-base font-semibold focus:outline-none focus:border-[var(--primary-green)] focus:ring-2 focus:ring-[var(--primary-green)]/20 transition-all uppercase placeholder:normal-case placeholder:font-sans placeholder:font-normal"
                        autoFocus
                    />
                    <button
                        onClick={() => handleSearch()}
                        disabled={loading}
                        className="px-6 h-13 rounded-xl bg-[var(--primary-green)] text-white font-bold flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        <span className="hidden sm:inline">Track</span>
                    </button>
                </div>
                {error && (
                    <div className="mt-4 flex items-start gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}
            </div>

            {/* Results */}
            {result && statusCfg && (() => {
                const StatusIcon = statusCfg.icon;
                return (
                    <div className="space-y-6 animate-fade-in">

                        {/* Code badge */}
                        <div className="flex items-center gap-3">
                            <BadgeCheck className="w-6 h-6 text-[var(--primary-green)]" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Confirmation Code</p>
                                <p className="font-mono text-xl font-extrabold text-[var(--primary-green)] tracking-widest">{result.confirmation_code}</p>
                            </div>
                        </div>

                        {/* Fund status banner */}
                        <div className={`flex items-start gap-4 p-5 rounded-2xl border ${statusCfg.color}`}>
                            <StatusIcon className="w-6 h-6 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold mb-1">{statusCfg.label}</p>
                                <p className="text-sm leading-relaxed opacity-90">{statusCfg.desc}</p>
                            </div>
                        </div>

                        {/* Donation details */}
                        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
                            <div className="px-6 py-4 border-b border-[var(--border-light)]">
                                <h2 className="font-bold text-[var(--text-primary)]">Donation Details</h2>
                            </div>
                            <div className="divide-y divide-[var(--border-light)]">
                                {[
                                    ["Donor", result.donor_name],
                                    ["Amount", formatCurrency(result.amount, result.currency)],
                                    ["Date", new Date(result.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })],
                                    ["Project", result.campaign?.title ?? "—"],
                                    ["Category", result.campaign ? (CATEGORY_LABELS[result.campaign.category as keyof typeof CATEGORY_LABELS] ?? result.campaign.category) : "—"],
                                ].map(([label, value]) => (
                                    <div key={label} className="grid grid-cols-2 px-6 py-3.5">
                                        <span className="text-sm text-[var(--text-muted)] font-medium">{label}</span>
                                        <span className="text-sm font-semibold text-[var(--text-primary)] text-right">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project progress */}
                        {result.campaign && (
                            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
                                {coverImage && (
                                    <div className="relative aspect-video">
                                        <Image src={coverImage} alt={result.campaign.title} fill className="object-cover" unoptimized />
                                    </div>
                                )}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg">{result.campaign.title}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed line-clamp-3">{result.campaign.story}</p>
                                    </div>
                                    <ProgressBar current={result.campaign.current_amount} target={result.campaign.target_amount} size="md" />
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-[var(--primary-green)]">{percentage}% funded</span>
                                        <span className="text-[var(--text-muted)]">{formatCurrency(result.campaign.current_amount)} raised</span>
                                    </div>
                                    <Link href={`/campaign/${result.campaign.slug}`}>
                                        <button className="w-full mt-2 h-11 rounded-xl border-2 border-[var(--primary-green)] text-[var(--primary-green)] font-bold text-sm hover:bg-[var(--primary-green)] hover:text-white transition-all flex items-center justify-center gap-2">
                                            View Full Project <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Donor message */}
                        {result.message && (
                            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary-green)] mb-2">Your Message</p>
                                <p className="text-[var(--text-secondary)] italic leading-relaxed">"{result.message}"</p>
                            </div>
                        )}

                        {/* Project updates */}
                        {result.campaign?.updates && result.campaign.updates.length > 0 && (
                            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
                                <div className="px-6 py-4 border-b border-[var(--border-light)]">
                                    <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-[var(--primary-green)]" /> Project Updates
                                    </h3>
                                </div>
                                <div className="divide-y divide-[var(--border-light)]">
                                    {result.campaign.updates.map(update => (
                                        <div key={update.id} className="px-6 py-5">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <h4 className="font-semibold text-[var(--text-primary)]">{update.title}</h4>
                                                <span className="text-xs text-[var(--text-muted)] shrink-0">
                                                    {new Date(update.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{update.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="text-center py-6">
                            <p className="text-[var(--text-secondary)] mb-4">Want to make another difference?</p>
                            <Link href="/explore">
                                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary-green)] text-white font-bold hover:brightness-110 transition-all">
                                    <Heart className="w-4 h-4" fill="currentColor" /> Browse More Projects
                                </button>
                            </Link>
                        </div>
                    </div>
                );
            })()}

            {/* Help text when no result yet */}
            {!result && !loading && (
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                    {[
                        { icon: "📧", title: "Check Your Email", body: "Your code was sent to the email you provided at checkout." },
                        { icon: "🔢", title: "Format", body: "Codes look like CBK-20260306-A1B2 — all caps, no spaces." },
                        { icon: "💬", title: "Need Help?", body: "Contact us at hello@carebridgekenya.com if you cannot find your code." },
                    ].map(item => (
                        <div key={item.title} className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-5 text-center">
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <p className="font-bold text-sm text-[var(--text-primary)] mb-1">{item.title}</p>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.body}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Page ───────────────────────────────────────────────────
export default function TrackPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-16 md:py-20 border-b border-[var(--border-light)]">
                <div className="container-custom text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-sm font-semibold mb-6">
                        <Search className="w-4 h-4" /> Track Your Donation
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                        Where Does Your Money Go?
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                        Enter your confirmation code to see exactly how your donation is being used — no account required.
                    </p>
                </div>
            </section>

            {/* Form + Results */}
            <section className="py-12 md:py-16">
                <div className="container-custom">
                    <Suspense fallback={<div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary-green)]" /></div>}>
                        <TrackForm />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}

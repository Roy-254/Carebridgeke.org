"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Plus, TrendingUp, Users, Target, Clock, BadgeCheck, ChevronRight,
    BarChart3, Eye, Pencil, MoreVertical, CheckCircle2, XCircle,
    AlertCircle, LayoutDashboard, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency, calculatePercentage, formatDate, getDaysRemaining } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Campaign {
    id: string;
    title: string;
    slug: string;
    category: string;
    status: string;
    target_amount: number;
    current_amount: number;
    deadline?: string;
    no_deadline: boolean;
    created_at: string;
    is_verified: boolean;
    images?: { storage_url: string; order_index: number }[];
    donations?: { id: string; amount: number; status: string; created_at: string }[];
}

interface Profile {
    full_name: string;
    avatar_url?: string | null;
    is_verified: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending_review: { label: "Under Review", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", icon: <AlertCircle className="w-3 h-3" /> },
    active: { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    completed: { label: "Completed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    paused: { label: "Paused", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", icon: <XCircle className="w-3 h-3" /> },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400", icon: <XCircle className="w-3 h-3" /> },
};

export function CreatorDashboardClient({ campaigns, profile }: { campaigns: Campaign[]; profile: Profile }) {
    const [filter, setFilter] = useState<string>("all");

    const confirmedDonations = (c: Campaign) =>
        (c.donations ?? []).filter(d => d.status === "confirmed");

    const totalRaised = campaigns.reduce((sum, c) => sum + c.current_amount, 0);
    const totalDonors = campaigns.reduce((sum, c) => sum + confirmedDonations(c).length, 0);
    const activeCampaigns = campaigns.filter(c => c.status === "active").length;

    const filteredCampaigns = filter === "all" ? campaigns : campaigns.filter(c => c.status === filter);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-10">
            <div className="container-custom max-w-6xl space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--primary-green)]/10 flex items-center justify-center text-2xl font-extrabold text-[var(--primary-green)]">
                            {profile.full_name[0]}
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                                {profile.full_name}
                                {profile.is_verified && <BadgeCheck className="w-5 h-5 text-[var(--primary-green)]" />}
                            </h1>
                            <p className="text-[var(--text-muted)] text-sm">Creator Dashboard</p>
                        </div>
                    </div>
                    <Link href="/campaign/create">
                        <Button variant="primary" className="gap-2 h-11 px-6 font-bold shadow-lg shadow-[var(--primary-green)]/20">
                            <Plus className="w-4 h-4" /> New Campaign
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Raised", value: formatCurrency(totalRaised), icon: TrendingUp, color: "text-[var(--primary-green)]" },
                        { label: "Total Donors", value: totalDonors.toString(), icon: Users, color: "text-blue-500" },
                        { label: "Campaigns", value: campaigns.length.toString(), icon: List, color: "text-purple-500" },
                        { label: "Active Now", value: activeCampaigns.toString(), icon: BarChart3, color: "text-orange-500" },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] space-y-3">
                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--bg-primary)]")}>
                                <Icon className={cn("w-5 h-5", color)} />
                            </div>
                            <div>
                                <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">{value}</div>
                                <div className="text-xs text-[var(--text-muted)] font-medium">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {["all", "active", "pending_review", "completed", "paused", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold transition-all capitalize",
                                filter === s
                                    ? "bg-[var(--primary-green)] text-white shadow"
                                    : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-light)]"
                            )}
                        >
                            {s === "all" ? "All Campaigns" : s.replace("_", " ")}
                        </button>
                    ))}
                </div>

                {/* Campaign list */}
                {filteredCampaigns.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                        <LayoutDashboard className="w-12 h-12 text-[var(--text-muted)] mx-auto" />
                        <p className="text-[var(--text-secondary)] font-medium">No campaigns here yet.</p>
                        <Link href="/campaign/create">
                            <Button variant="primary" className="gap-2">
                                <Plus className="w-4 h-4" /> Start a Campaign
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCampaigns.map((campaign) => {
                            const statusInfo = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG["pending_review"];
                            const confirmed = confirmedDonations(campaign);
                            const percentage = calculatePercentage(campaign.current_amount, campaign.target_amount);
                            const coverImage = campaign.images?.sort((a, b) => a.order_index - b.order_index)[0]?.storage_url;
                            const daysLeft = campaign.deadline ? getDaysRemaining(campaign.deadline) : null;

                            return (
                                <div key={campaign.id} className="flex flex-col md:flex-row gap-0 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden hover:border-[var(--primary-green)]/30 transition-all group">
                                    {/* Cover thumbnail */}
                                    <div className="relative w-full md:w-48 aspect-video md:aspect-square shrink-0">
                                        {coverImage ? (
                                            <Image src={coverImage} alt={campaign.title} fill className="object-cover" unoptimized />
                                        ) : (
                                            <div className="w-full h-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-muted)]">
                                                <Target className="w-8 h-8" />
                                            </div>
                                        )}
                                        <div className={cn("absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1", statusInfo.color)}>
                                            {statusInfo.icon}
                                            {statusInfo.label}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5 space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                                                    {CATEGORY_LABELS[campaign.category as keyof typeof CATEGORY_LABELS] ?? campaign.category}
                                                </div>
                                                <h3 className="font-bold text-[var(--text-primary)] text-base leading-snug group-hover:text-[var(--primary-green)] transition-colors">
                                                    {campaign.title}
                                                </h3>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <Link href={`/campaign/${campaign.slug}`} title="View campaign">
                                                    <button className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-primary)] transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-primary)] transition-colors" title="Edit (coming soon)">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <ProgressBar current={campaign.current_amount} target={campaign.target_amount} size="sm" />
                                            <div className="flex justify-between text-xs font-bold text-[var(--text-muted)]">
                                                <span className="text-[var(--primary-green)]">{formatCurrency(campaign.current_amount)} raised ({percentage}%)</span>
                                                <span>Goal: {formatCurrency(campaign.target_amount)}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-5 text-xs">
                                            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                                                <Users className="w-3.5 h-3.5" />
                                                <span>{confirmed.length} donors</span>
                                            </div>
                                            {daysLeft !== null && (
                                                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{daysLeft > 0 ? `${daysLeft} days left` : "Ended"}</span>
                                                </div>
                                            )}
                                            {campaign.no_deadline && (
                                                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>No deadline</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                                                <BarChart3 className="w-3.5 h-3.5" />
                                                <span>Created {formatDate(campaign.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

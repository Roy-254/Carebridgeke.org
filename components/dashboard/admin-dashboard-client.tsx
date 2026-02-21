"use client";

import { useState } from "react";
import {
    BarChart3, Users, TrendingUp, Clock, CheckCircle2, XCircle, Eye,
    ShieldCheck, AlertCircle, Search
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Campaign {
    id: string;
    title: string;
    slug: string;
    category: string;
    status: string;
    target_amount: number;
    current_amount: number;
    created_at: string;
    is_verified: boolean;
    creator?: {
        id: string;
        full_name: string;
        email?: string;
        is_verified: boolean;
    };
}

interface Stats {
    totalCampaigns: number;
    totalDonations: number;
    totalRevenue: number;
    pendingReview: number;
}

const STATUS_COLORS: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    pending_review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    paused: "bg-gray-100 text-gray-600",
};

export function AdminDashboardClient({ campaigns, stats }: { campaigns: Campaign[]; stats: Stats }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [localCampaigns, setLocalCampaigns] = useState(campaigns);

    const filteredCampaigns = localCampaigns.filter(c => {
        const matchSearch = [c.title, c.creator?.full_name ?? "", c.category].some(
            field => field.toLowerCase().includes(search.toLowerCase())
        );
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch("/api/admin/campaign-status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (res.ok) {
                setLocalCampaigns(prev =>
                    prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
                );
            }
        } catch (err) {
            console.error("Status update error:", err);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-10">
            <div className="container-custom max-w-7xl space-y-8">

                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary-green)] mb-2">
                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                    </div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Platform Dashboard</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Review campaigns, monitor donations, and manage the platform.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: "text-[var(--primary-green)]", bg: "bg-green-50 dark:bg-green-900/10" },
                        { label: "Confirmed Donations", value: stats.totalDonations.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
                        { label: "Total Campaigns", value: stats.totalCampaigns.toLocaleString(), icon: BarChart3, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/10" },
                        { label: "Pending Review", value: stats.pendingReview.toLocaleString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/10" },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] relative overflow-hidden">
                            <div className={cn("absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-50", bg)} />
                            <Icon className={cn("w-5 h-5 mb-3 relative z-10", color)} />
                            <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">{value}</div>
                            <div className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Pending review highlight */}
                {stats.pendingReview > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl text-yellow-800 dark:text-yellow-300">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-bold">{stats.pendingReview} campaign{stats.pendingReview !== 1 ? "s" : ""} waiting for your review.</p>
                        <button onClick={() => setStatusFilter("pending_review")} className="ml-auto text-xs font-bold underline hover:no-underline">View all</button>
                    </div>
                )}

                {/* Campaigns table */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
                    {/* Table header / filters */}
                    <div className="p-5 flex flex-col md:flex-row gap-4 border-b border-[var(--border-light)]">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                placeholder="Search campaigns or creators..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 h-10 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 px-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] text-sm text-[var(--text-secondary)] focus:outline-none appearance-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending_review">Pending Review</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="paused">Paused</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border-light)] text-left">
                                    {["Campaign", "Creator", "Category", "Progress", "Status", "Date", "Actions"].map(col => (
                                        <th key={col} className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-light)]/60">
                                {filteredCampaigns.map((campaign) => (
                                    <tr key={campaign.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-[var(--text-primary)] max-w-[200px] truncate">{campaign.title}</div>
                                            {campaign.is_verified && (
                                                <div className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400 mt-0.5 font-bold">
                                                    <ShieldCheck className="w-3 h-3" /> Verified
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-[var(--text-secondary)] text-xs font-medium">
                                                {campaign.creator?.full_name ?? "—"}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[var(--text-muted)] capitalize">
                                            {CATEGORY_LABELS[campaign.category as keyof typeof CATEGORY_LABELS] ?? campaign.category}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-xs font-mono font-bold text-[var(--primary-green)]">
                                                {formatCurrency(campaign.current_amount)}
                                            </div>
                                            <div className="text-[10px] text-[var(--text-muted)]">of {formatCurrency(campaign.target_amount)}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold capitalize whitespace-nowrap", STATUS_COLORS[campaign.status] ?? "bg-gray-100 text-gray-600")}>
                                                {campaign.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[var(--text-muted)] whitespace-nowrap">
                                            {formatDate(campaign.created_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <a
                                                    href={`/campaign/${campaign.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary-green)] transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                                {campaign.status === "pending_review" && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(campaign.id, "active")}
                                                            disabled={updatingId === campaign.id}
                                                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(campaign.id, "rejected")}
                                                            disabled={updatingId === campaign.id}
                                                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {campaign.status === "active" && (
                                                    <button
                                                        onClick={() => updateStatus(campaign.id, "paused")}
                                                        disabled={updatingId === campaign.id}
                                                        className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-xs font-bold"
                                                        title="Pause"
                                                    >
                                                        Pause
                                                    </button>
                                                )}
                                                {campaign.status === "paused" && (
                                                    <button
                                                        onClick={() => updateStatus(campaign.id, "active")}
                                                        disabled={updatingId === campaign.id}
                                                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-xs font-bold"
                                                        title="Reactivate"
                                                    >
                                                        Activate
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCampaigns.length === 0 && (
                            <div className="py-16 text-center text-[var(--text-muted)]">No campaigns match your filters.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Search, RefreshCw, CheckCircle2, XCircle, Clock,
    TrendingUp, Users, DollarSign, Loader2, ChevronLeft, ChevronRight,
    X, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { formatCurrency } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────
interface Donation {
    id: string;
    confirmation_code: string | null;
    donor_name: string | null;
    donor_email: string;
    donor_phone: string | null;
    amount: number;
    currency: string;
    donation_type: string;
    project_category: string | null;
    status: "pending" | "confirmed" | "failed" | "refunded";
    fund_status: string;
    payment_method: string;
    mpesa_receipt_code: string | null;
    subscribe_updates: boolean;
    is_anonymous: boolean;
    message: string | null;
    created_at: string;
    completed_at: string | null;
    verified_at: string | null;
    admin_notes: string | null;
    campaign?: { id: string; title: string; slug: string; category: string } | null;
}

interface Stats {
    pending_count: number;
    pending_total: number;
    confirmed_today_count: number;
    confirmed_today_total: number;
    all_time_confirmed_total: number;
}

const STATUS_CONFIG = {
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", icon: Clock },
    confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", icon: CheckCircle2 },
    failed: { label: "Failed", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", icon: XCircle },
    refunded: { label: "Refunded", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300", icon: XCircle },
};

// ─── Mark-as-Paid Modal ───────────────────────────────────────────
function MarkPaidModal({
    donation,
    onClose,
    onSuccess,
}: {
    donation: Donation;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [receipt, setReceipt] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function confirm() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/donations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: donation.id,
                    action: "mark_paid",
                    mpesa_receipt_code: receipt.trim() || null,
                    admin_notes: notes.trim() || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error ?? "Failed"); return; }
            onSuccess();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-light)] shadow-2xl w-full max-w-md animate-fade-in">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-light)]">
                    <h2 className="font-extrabold text-[var(--text-primary)]">Mark as Paid</h2>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Donation summary */}
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-1.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-muted)]">Donor</span>
                            <span className="font-semibold text-[var(--text-primary)]">{donation.donor_name ?? "Anonymous"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-muted)]">Email</span>
                            <span className="font-semibold text-[var(--text-primary)]">{donation.donor_email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-muted)]">Amount</span>
                            <span className="font-bold text-[var(--primary-green)] font-mono">{formatCurrency(donation.amount, donation.currency as "KES" | "USD")}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-muted)]">Code</span>
                            <span className="font-mono text-[var(--text-primary)]">{donation.confirmation_code ?? "—"}</span>
                        </div>
                    </div>

                    {/* Receipt code */}
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">
                            M-Pesa Receipt Code <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={receipt}
                            onChange={(e) => setReceipt(e.target.value.toUpperCase())}
                            placeholder="e.g. QFX123ABC"
                            className="w-full h-11 px-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30 focus:border-[var(--primary-green)] transition-all"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">Enter the code from the donor's M-Pesa SMS</p>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">
                            Internal Notes <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="Any internal notes about this verification…"
                            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30 focus:border-[var(--primary-green)] transition-all resize-none"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />{error}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-[var(--border-light)]">
                    <button
                        onClick={onClose}
                        className="flex-1 h-11 rounded-xl border-2 border-[var(--border-medium)] text-[var(--text-secondary)] font-bold text-sm hover:border-[var(--border-medium)] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirm}
                        disabled={loading}
                        className="flex-1 h-11 rounded-xl bg-[var(--primary-green)] text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Detail view (right panel) ───────────────────────────────────
function DonationDetail({ donation, onClose, onMarkPaid }: {
    donation: Donation;
    onClose: () => void;
    onMarkPaid: (d: Donation) => void;
}) {
    const cfg = STATUS_CONFIG[donation.status] ?? STATUS_CONFIG.pending;
    const Icon = cfg.icon;

    return (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-5 space-y-5 sticky top-24">
            <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-[var(--text-primary)]">Donation Detail</h3>
                <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${cfg.color}`}>
                <Icon className="w-4 h-4" />
                {cfg.label}
            </div>

            <dl className="space-y-2 text-sm">
                {[
                    ["Code", donation.confirmation_code ?? "—"],
                    ["Name", donation.donor_name ?? "Anonymous"],
                    ["Email", donation.donor_email],
                    ["Phone", donation.donor_phone ?? "—"],
                    ["Amount", formatCurrency(donation.amount, donation.currency as "KES" | "USD")],
                    ["Type", donation.donation_type],
                    ["Project", (donation.campaign as any)?.title ?? donation.project_category ?? "General Fund"],
                    ["Method", donation.payment_method],
                    ["M-Pesa Receipt", donation.mpesa_receipt_code ?? "—"],
                    ["Date", new Date(donation.created_at).toLocaleString("en-KE")],
                    ["Verified", donation.verified_at ? new Date(donation.verified_at).toLocaleString("en-KE") : "—"],
                ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 border-b border-[var(--border-light)] pb-2 last:border-0">
                        <dt className="text-[var(--text-muted)] shrink-0">{label}</dt>
                        <dd className="font-semibold text-[var(--text-primary)] text-right break-all">{value}</dd>
                    </div>
                ))}
            </dl>

            {donation.message && (
                <div className="bg-[var(--bg-primary)] rounded-xl p-3">
                    <p className="text-xs text-[var(--text-muted)] mb-1 font-bold uppercase tracking-wide">Donor Message</p>
                    <p className="text-sm text-[var(--text-secondary)] italic">"{donation.message}"</p>
                </div>
            )}

            {donation.admin_notes && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                    <p className="text-xs text-amber-600 mb-1 font-bold uppercase tracking-wide">Admin Notes</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{donation.admin_notes}</p>
                </div>
            )}

            {donation.status === "pending" && (
                <button
                    onClick={() => onMarkPaid(donation)}
                    className="w-full h-11 rounded-xl bg-[var(--primary-green)] text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                    <CheckCircle2 className="w-4 h-4" /> Mark as Paid
                </button>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────
export default function AdminDonationsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("pending");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [selected, setSelected] = useState<Donation | null>(null);
    const [markPaidTarget, setMarkPaidTarget] = useState<Donation | null>(null);

    const totalPages = Math.ceil(total / 20);

    // Redirect non-admins
    useEffect(() => {
        if (!isLoading && (!user || user.role !== "admin")) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    const fetchDonations = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), status: statusFilter });
        if (search) params.set("search", search);
        try {
            const res = await fetch(`/api/admin/donations?${params.toString()}`);
            const data = await res.json();
            setDonations(data.donations ?? []);
            setTotal(data.total ?? 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, search]);

    useEffect(() => { if (user?.role === "admin") fetchDonations(); }, [fetchDonations, user]);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-green)]" />
        </div>
    );
    if (!user || user.role !== "admin") return null;

    function handleMarkPaidSuccess() {
        setMarkPaidTarget(null);
        setSelected(null);
        fetchDonations();
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-light)] px-6 py-5">
                <div className="container-custom max-w-7xl flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Donations Admin</h1>
                        <p className="text-sm text-[var(--text-muted)]">Manage and verify incoming donations</p>
                    </div>
                    <button
                        onClick={fetchDonations}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-light)] text-sm font-bold text-[var(--text-secondary)] hover:border-[var(--primary-green)] hover:text-[var(--primary-green)] transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                </div>
            </div>

            <div className="container-custom max-w-7xl py-8 space-y-6">

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Clock, label: "Pending", value: `${donations.filter(d => d.status === "pending").length} donations`, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
                        { icon: CheckCircle2, label: "Confirmed", value: `${donations.filter(d => d.status === "confirmed").length} donations`, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
                        { icon: DollarSign, label: "Total Shown", value: formatCurrency(donations.reduce((s, d) => d.status === "confirmed" ? s + d.amount : s, 0)), color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
                        { icon: Users, label: "Total Records", value: `${total}`, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                        <div key={label} className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-4">
                            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                                <Icon className={`w-4 h-4 ${color}`} />
                            </div>
                            <p className="text-lg font-extrabold text-[var(--text-primary)]">{value}</p>
                            <p className="text-xs text-[var(--text-muted)]">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    {/* Status filter */}
                    <div className="flex rounded-xl border border-[var(--border-light)] overflow-hidden">
                        {["all", "pending", "confirmed", "failed"].map((s) => (
                            <button
                                key={s}
                                onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={`px-4 py-2 text-sm font-bold capitalize transition-colors ${statusFilter === s ? "bg-[var(--primary-green)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)]"}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex gap-2 flex-1 min-w-64">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
                                placeholder="Code, email, or phone…"
                                className="w-full pl-9 pr-4 h-10 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30 focus:border-[var(--primary-green)] transition-all"
                            />
                        </div>
                        <button
                            onClick={() => { setSearch(searchInput); setPage(1); }}
                            className="px-4 h-10 rounded-xl bg-[var(--primary-green)] text-white text-sm font-bold hover:brightness-110 transition-all"
                        >
                            Search
                        </button>
                        {search && (
                            <button onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }} className="px-3 h-10 rounded-xl border border-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Main layout: table + detail panel */}
                <div className="flex gap-6">

                    {/* Table */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
                            {loading ? (
                                <div className="flex justify-center py-16">
                                    <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-green)]" />
                                </div>
                            ) : donations.length === 0 ? (
                                <div className="text-center py-16">
                                    <TrendingUp className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                                    <p className="font-bold text-[var(--text-primary)]">No donations found</p>
                                    <p className="text-sm text-[var(--text-muted)]">Try changing your filters</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px]">
                                        <thead className="bg-[var(--bg-tertiary)] border-b border-[var(--border-light)]">
                                            <tr>
                                                {["Code", "Donor", "Amount", "Project", "Status", "Date", ""].map(h => (
                                                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border-light)]">
                                            {donations.map((d) => {
                                                const cfg = STATUS_CONFIG[d.status] ?? STATUS_CONFIG.pending;
                                                const Icon = cfg.icon;
                                                return (
                                                    <tr
                                                        key={d.id}
                                                        onClick={() => setSelected(d)}
                                                        className={`cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)] ${selected?.id === d.id ? "bg-[var(--primary-green)]/5" : ""}`}
                                                    >
                                                        <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--text-primary)]">
                                                            {d.confirmation_code ?? "—"}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <p className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[120px]">
                                                                {d.donor_name ?? "Anonymous"}
                                                            </p>
                                                            <p className="text-xs text-[var(--text-muted)] truncate max-w-[120px]">{d.donor_email}</p>
                                                        </td>
                                                        <td className="px-4 py-3 font-mono font-bold text-[var(--primary-green)] text-sm whitespace-nowrap">
                                                            {formatCurrency(d.amount, d.currency as "KES" | "USD")}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-[var(--text-secondary)] max-w-[150px] truncate">
                                                            {(d.campaign as any)?.title ?? d.project_category ?? "General Fund"}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.color}`}>
                                                                <Icon className="w-3 h-3" />
                                                                {cfg.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">
                                                            {new Date(d.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {d.status === "pending" && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setMarkPaidTarget(d); }}
                                                                    className="px-3 py-1 rounded-lg bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-xs font-bold hover:bg-[var(--primary-green)] hover:text-white transition-all whitespace-nowrap"
                                                                >
                                                                    Mark Paid
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border-light)]">
                                    <span className="text-sm text-[var(--text-muted)]">
                                        Page {page} of {totalPages} · {total} total
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                            className="p-2 rounded-lg border border-[var(--border-light)] disabled:opacity-40 hover:bg-[var(--bg-tertiary)] transition-colors">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                            className="p-2 rounded-lg border border-[var(--border-light)] disabled:opacity-40 hover:bg-[var(--bg-tertiary)] transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detail panel */}
                    {selected && (
                        <div className="w-80 shrink-0 hidden lg:block">
                            <DonationDetail
                                donation={selected}
                                onClose={() => setSelected(null)}
                                onMarkPaid={setMarkPaidTarget}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Mark as paid modal */}
            {markPaidTarget && (
                <MarkPaidModal
                    donation={markPaidTarget}
                    onClose={() => setMarkPaidTarget(null)}
                    onSuccess={handleMarkPaidSuccess}
                />
            )}
        </div>
    );
}

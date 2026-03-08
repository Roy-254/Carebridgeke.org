"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Heart, Loader2, CheckCircle2, ChevronDown,
    User, Mail, Phone, Sparkles, Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORY_LABELS } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────
interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
}

// ─── Constants ───────────────────────────────────────────────────
const AMOUNTS = [99];

const IMPACT: Record<number, string> = {
    99: "Your small gift makes a huge difference in Kenyan lives today.",
};

function getImpact(amount: number): string {
    if (amount >= 99) return IMPACT[99];
    return "";
}

// ─── Phone formatter ─────────────────────────────────────────────
function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

// ─── DonationForm (inner — needs searchParams) ───────────────────
function DonationForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const preselectedSlug = searchParams.get("project");

    // State: donation allocation
    const [donationType, setDonationType] = useState<"general" | "project" | "category">("general");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(false);

    // State: amount
    const [preset, setPreset] = useState<number | null>(99);
    const [customActive] = useState(false);

    // State: donor details
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subscribe, setSubscribe] = useState(false);
    const [agreedTerms, setAgreedTerms] = useState(false);

    // State: submission
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Derived
    const amount = preset ?? 0;
    const impact = getImpact(amount);

    const formReady =
        amount >= 99 &&
        email.trim() !== "" &&
        phone.replace(/\D/g, "").length >= 9 &&
        agreedTerms;

    // ── Load projects ──────────────────────────────────────────
    useEffect(() => {
        if (donationType !== "project") return;
        setProjectsLoading(true);
        const supabase = createClient();
        Promise.resolve(supabase
            .from("campaigns")
            .select("id, title, slug, category")
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(50))
            .then(({ data }) => {
                const list = (data ?? []) as Project[];
                setProjects(list);
                // Auto-select if ?project=slug was in URL
                if (preselectedSlug) {
                    const found = list.find((p) => p.slug === preselectedSlug);
                    if (found) setSelectedProject(found);
                }
            })
            .finally(() => setProjectsLoading(false));
    }, [donationType, preselectedSlug]);

    // Auto-switch to project tab if preselected slug exists
    useEffect(() => {
        if (preselectedSlug) setDonationType("project");
    }, [preselectedSlug]);

    // ── Validation ────────────────────────────────────────────
    function validate(): boolean {
        const e: Record<string, string> = {};
        if (amount < 99) e.amount = "Donation amount must be KES 99.";
        if (!email.trim()) e.email = "Email address is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
        const digits = phone.replace(/\D/g, "");
        if (!digits || digits.length < 9) e.phone = "Enter a valid Kenyan phone number (9 digits).";
        if (!agreedTerms) e.terms = "Please agree to our Terms of Service.";
        if (donationType === "project" && !selectedProject) e.project = "Please select a project.";
        if (donationType === "category" && !selectedCategory) e.category = "Please select a category.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    // ── Submit ────────────────────────────────────────────────
    async function handleSubmit() {
        if (!validate()) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/donations/manual", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    donor_name: name.trim() || null,
                    donor_email: email.trim().toLowerCase(),
                    donor_phone: "+254" + phone.replace(/\D/g, "").slice(-9),
                    amount,
                    currency: "KES",
                    donation_type: donationType,
                    campaign_id: selectedProject?.id ?? null,
                    project_category: donationType === "category" ? selectedCategory : null,
                    campaign_title: selectedProject?.title ?? null,
                    subscribe_updates: subscribe,
                    is_anonymous: !name.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrors({ form: data.error ?? "Something went wrong. Please try again." });
                return;
            }
            // Redirect to instructions page
            const params = new URLSearchParams({
                code: data.confirmation_code,
                amount: String(amount),
                email: email.trim().toLowerCase(),
                phone: "+254" + phone.replace(/\D/g, "").slice(-9),
                supporting: data.supporting,
            });
            router.push(`/donate/instructions?${params.toString()}`);
        } catch {
            setErrors({ form: "Network error. Please check your connection and try again." });
        } finally {
            setSubmitting(false);
        }
    }

    // ── Render ────────────────────────────────────────────────
    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-16">

            {/* Global form error */}
            {errors.form && (
                <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-5 py-4 text-red-700 dark:text-red-300">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{errors.form}</p>
                </div>
            )}

            {/* ── SECTION 1: Allocation ────────────────────────── */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                <h2 className="text-lg font-extrabold text-[var(--text-primary)] mb-1">
                    Where should your donation go?
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-5">
                    Choose how to direct your support.
                </p>

                <div className="space-y-3">
                    {/* General Fund */}
                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${donationType === "general" ? "border-[var(--primary-green)] bg-[var(--primary-green)]/5" : "border-[var(--border-light)] hover:border-[var(--primary-green)]/40"}`}>
                        <input type="radio" name="dtype" value="general" checked={donationType === "general"}
                            onChange={() => setDonationType("general")} className="mt-1 accent-[var(--primary-green)]" />
                        <div>
                            <p className="font-bold text-[var(--text-primary)] text-sm">General Fund (Unrestricted)</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">Direct funds to our most urgent needs</p>
                        </div>
                    </label>

                    {/* Specific Project */}
                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${donationType === "project" ? "border-[var(--primary-green)] bg-[var(--primary-green)]/5" : "border-[var(--border-light)] hover:border-[var(--primary-green)]/40"}`}>
                        <input type="radio" name="dtype" value="project" checked={donationType === "project"}
                            onChange={() => setDonationType("project")} className="mt-1 accent-[var(--primary-green)]" />
                        <div className="flex-1">
                            <p className="font-bold text-[var(--text-primary)] text-sm">Specific Project</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">Choose a campaign to support directly</p>
                            {donationType === "project" && (
                                <div className="mt-3 relative">
                                    {projectsLoading ? (
                                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Loading projects…
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <select
                                                value={selectedProject?.id ?? ""}
                                                onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value) ?? null)}
                                                className="w-full appearance-none h-11 pl-4 pr-10 rounded-xl border-2 border-[var(--border-light)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-green)] transition-all"
                                            >
                                                <option value="">— Select a project —</option>
                                                {projects.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.title} ({CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS] ?? p.category})
                                                    </option>
                                                ))}
                                                {projects.length === 0 && <option disabled>No active projects yet</option>}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                                        </div>
                                    )}
                                    {errors.project && <p className="text-xs text-red-600 mt-1">{errors.project}</p>}
                                </div>
                            )}
                        </div>
                    </label>

                    {/* Category */}
                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${donationType === "category" ? "border-[var(--primary-green)] bg-[var(--primary-green)]/5" : "border-[var(--border-light)] hover:border-[var(--primary-green)]/40"}`}>
                        <input type="radio" name="dtype" value="category" checked={donationType === "category"}
                            onChange={() => setDonationType("category")} className="mt-1 accent-[var(--primary-green)]" />
                        <div className="flex-1">
                            <p className="font-bold text-[var(--text-primary)] text-sm">Program Category</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">Support a specific cause area</p>
                            {donationType === "category" && (
                                <div className="mt-3 relative">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full appearance-none h-11 pl-4 pr-10 rounded-xl border-2 border-[var(--border-light)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-green)] transition-all"
                                    >
                                        <option value="">— Select a category —</option>
                                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                                    {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
                                </div>
                            )}
                        </div>
                    </label>
                </div>
            </div>

            {/* ── SECTION 2: Amount ──────────────────────────────── */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                <h2 className="text-lg font-extrabold text-[var(--text-primary)] mb-1">
                    Select Amount <span className="text-[var(--text-muted)] font-semibold">(KES)</span>
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-5">
                    Every shilling goes directly to the people who need it.
                </p>

                {/* Preset grid */}
                <div className="grid grid-cols-1 gap-2 mb-4">
                    {AMOUNTS.map((a) => (
                        <button
                            key={a}
                            type="button"
                            onClick={() => { setPreset(a); }}
                            className={`h-14 rounded-xl font-bold text-lg transition-all ${!customActive && preset === a
                                ? "bg-[var(--primary-green)] text-white shadow-md shadow-green-900/20 ring-4 ring-[var(--primary-green)]/20"
                                : "border-2 border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--primary-green)] hover:text-[var(--primary-green)] bg-[var(--bg-primary)]"
                                }`}
                        >
                            KES {a}
                        </button>
                    ))}
                </div>



                {/* Impact message */}
                {amount >= 99 && (
                    <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3 animate-fade-in">
                        <Sparkles className="w-4 h-4 text-[var(--primary-green)] shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold text-[var(--primary-green)]">{impact}</p>
                    </div>
                )}

                {errors.amount && <p className="text-xs text-red-600 mt-2">{errors.amount}</p>}
            </div>

            {/* ── SECTION 3: Donor Details ──────────────────────── */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6 space-y-5">
                <div>
                    <h2 className="text-lg font-extrabold text-[var(--text-primary)] mb-1">Your Details</h2>
                    <p className="text-sm text-[var(--text-muted)]">
                        We need your contact info to send payment instructions and confirm your donation.
                    </p>
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">
                        Full Name <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full pl-10 pr-4 h-11 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30 focus:border-[var(--primary-green)] transition-all"
                        />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Leave blank to donate anonymously</p>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className={`w-full pl-10 pr-4 h-11 rounded-xl border ${errors.email ? "border-red-400" : "border-[var(--border-light)]"} bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30 focus:border-[var(--primary-green)] transition-all`}
                        />
                    </div>
                    {errors.email
                        ? <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                        : <p className="text-xs text-[var(--text-muted)] mt-1">For donation receipt and payment instructions</p>
                    }
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <div className="flex items-center h-11 px-3.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-tertiary)] text-sm font-bold text-[var(--text-secondary)] shrink-0">
                            🇰🇪 +254
                        </div>
                        <div className="relative flex-1">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(formatPhone(e.target.value))}
                                placeholder="712 345 678"
                                className={`w-full pl-10 pr-4 h-11 rounded-xl border ${errors.phone ? "border-red-400" : "border-[var(--border-light)]"} bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30 focus:border-[var(--primary-green)] transition-all`}
                                maxLength={11}
                            />
                        </div>
                    </div>
                    {errors.phone
                        ? <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                        : <p className="text-xs text-[var(--text-muted)] mt-1">We use this to confirm your M-Pesa payment</p>
                    }
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={subscribe}
                            onChange={(e) => setSubscribe(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded accent-[var(--primary-green)]"
                        />
                        <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-green)] transition-colors">
                                Subscribe to monthly impact updates
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                                Receive stories and progress from our projects
                            </p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={agreedTerms}
                            onChange={(e) => setAgreedTerms(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded accent-[var(--primary-green)]"
                        />
                        <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-green)] transition-colors">
                                I agree to the{" "}
                                <a href="/privacy" target="_blank" className="underline text-[var(--primary-green)]">Privacy Policy</a>
                                {" "}and{" "}
                                <a href="/terms" target="_blank" className="underline text-[var(--primary-green)]">Terms of Service</a>
                                {" "}<span className="text-red-500">*</span>
                            </p>
                        </div>
                    </label>
                    {errors.terms && <p className="text-xs text-red-600">{errors.terms}</p>}
                </div>
            </div>

            {/* ── SECTION 4: Submit ─────────────────────────────── */}
            <button
                type="button"
                onClick={handleSubmit}
                disabled={!formReady || submitting}
                className={`w-full h-14 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all duration-200 ${formReady && !submitting
                    ? "bg-[var(--primary-green)] hover:brightness-110 text-white shadow-lg shadow-green-900/20 cursor-pointer"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed"
                    }`}
            >
                {submitting
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                    : <><Heart className="w-5 h-5" fill="currentColor" /> Get Payment Instructions →</>
                }
            </button>

            {!formReady && (
                <p className="text-center text-xs text-[var(--text-muted)]">
                    Fill in amount, email, phone and accept the terms to continue.
                </p>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────
export default function DonatePage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">

            {/* Hero */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-14 md:py-18 border-b border-[var(--border-light)]">
                <div className="container-custom text-center max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-sm font-semibold mb-5">
                        <Heart className="w-4 h-4" fill="currentColor" /> Make a Donation
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-3 leading-tight">
                        Support Verified Projects
                    </h1>
                    <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                        Changing lives across Kenya — one donation at a time. <br className="hidden sm:block" />
                        100% of your gift reaches the people who need it.
                    </p>

                    {/* Trust badges */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                        {[
                            { icon: "🔒", text: "Secure & Private" },
                            { icon: "✅", text: "Verified Projects" },
                            { icon: "📊", text: "Full Transparency" },
                        ].map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-primary)] rounded-full border border-[var(--border-light)] text-xs font-semibold text-[var(--text-secondary)]">
                                {icon} {text}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="py-10 md:py-14">
                <div className="container-custom">
                    <Suspense fallback={
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-green)]" />
                        </div>
                    }>
                        <DonationForm />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}

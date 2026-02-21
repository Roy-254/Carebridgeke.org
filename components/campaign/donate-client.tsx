"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, ShieldCheck, Loader2, Smartphone, CreditCard,
    Heart, Lock, AlertCircle, Users, ChevronRight, BadgeCheck
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { SUGGESTED_DONATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DonateClientProps {
    campaign: {
        id: string;
        title: string;
        slug: string;
        current_amount: number;
        target_amount: number;
        deadline?: string;
        images?: { storage_url: string; order_index: number }[];
        creator?: { full_name: string; avatar_url?: string; is_verified?: boolean };
    };
}

type PayMethod = "mpesa" | "card";

export function DonateClient({ campaign }: DonateClientProps) {
    const router = useRouter();
    const [amount, setAmount] = useState<number | "">(1000);
    const [customAmount, setCustomAmount] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [payMethod, setPayMethod] = useState<PayMethod>("mpesa");
    const [donorName, setDonorName] = useState("");
    const [donorEmail, setDonorEmail] = useState("");
    const [donorPhone, setDonorPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const finalAmount = isCustom ? (Number(customAmount) || 0) : (Number(amount) || 0);
    const percentage = calculatePercentage(campaign.current_amount, campaign.target_amount);
    const coverImage = campaign.images?.sort((a, b) => a.order_index - b.order_index)[0]?.storage_url;

    const handlePreset = (val: number) => {
        setAmount(val);
        setIsCustom(false);
        setCustomAmount("");
    };

    const handleDonate = async () => {
        setError("");

        if (finalAmount < 50) {
            setError("Minimum donation is KES 50.");
            return;
        }
        if (!donorName.trim() && !isAnonymous) {
            setError("Please enter your name or choose to donate anonymously.");
            return;
        }
        if (payMethod === "mpesa" && !donorPhone.trim()) {
            setError("Please enter your M-Pesa phone number.");
            return;
        }
        if (donorEmail && !/\S+@\S+\.\S+/.test(donorEmail)) {
            setError("Please enter a valid email address for your receipt.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/flutterwave/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    campaign_id: campaign.id,
                    campaign_slug: campaign.slug,
                    amount: finalAmount,
                    currency: "KES",
                    donor_name: isAnonymous ? "Anonymous" : donorName.trim(),
                    donor_email: donorEmail.trim() || null,
                    donor_phone: payMethod === "mpesa" ? donorPhone.trim() : undefined,
                    message: message.trim() || null,
                    is_anonymous: isAnonymous,
                    payment_method: payMethod,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.payment_link) {
                throw new Error(data.error || "Failed to initiate payment.");
            }

            // Redirect to Flutterwave hosted payment page
            window.location.href = data.payment_link;
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Top nav */}
            <div className="border-b border-[var(--border-light)] py-4 sticky top-16 z-40 bg-[var(--bg-primary)]/90 backdrop-blur-md">
                <div className="container-custom flex items-center justify-between">
                    <Link
                        href={`/campaign/${campaign.slug}`}
                        className="flex items-center gap-1.5 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--primary-green)] transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Campaign
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-semibold">
                        <Lock className="w-3.5 h-3.5 text-blue-500" />
                        Secure Payment
                    </div>
                </div>
            </div>

            <main className="container-custom py-10 max-w-5xl">
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">

                    {/* ── Left: Campaign summary ── */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Campaign card */}
                        <div className="rounded-2xl border border-[var(--border-light)] overflow-hidden bg-[var(--bg-secondary)]">
                            {coverImage && (
                                <div className="relative aspect-video">
                                    <Image src={coverImage} alt={campaign.title} fill className="object-cover" unoptimized />
                                </div>
                            )}
                            <div className="p-5 space-y-3">
                                <h2 className="font-bold text-[var(--text-primary)] text-base leading-snug">{campaign.title}</h2>
                                {campaign.creator && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-[var(--primary-green)]/10 flex items-center justify-center text-xs font-bold text-[var(--primary-green)]">
                                            {campaign.creator.full_name[0]}
                                        </div>
                                        <span className="text-xs text-[var(--text-muted)] font-medium">by {campaign.creator.full_name}</span>
                                        {campaign.creator.is_verified && (
                                            <BadgeCheck className="w-3.5 h-3.5 text-[var(--primary-green)]" />
                                        )}
                                    </div>
                                )}
                                <div className="space-y-1.5">
                                    <ProgressBar current={campaign.current_amount} target={campaign.target_amount} size="sm" />
                                    <div className="flex justify-between text-xs font-bold text-[var(--text-muted)]">
                                        <span className="text-[var(--primary-green)]">{percentage}% funded</span>
                                        <span>{formatCurrency(campaign.current_amount)} raised</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="p-5 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-secondary)] space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Why donate safely here</p>
                            {[
                                { icon: ShieldCheck, text: "256-bit SSL encryption on all payments" },
                                { icon: BadgeCheck, text: "Campaigns verified by our Trust & Safety team" },
                                { icon: Users, text: "Funds tracked transparently" },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                    <Icon className="w-4 h-4 text-[var(--primary-green)] shrink-0" />
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Donation form ── */}
                    <div className="xl:col-span-3 space-y-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Make a Donation</h1>
                            <p className="text-[var(--text-secondary)] mt-1">Every shilling counts. Your generosity changes lives.</p>
                        </div>

                        {/* Error banner */}
                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Step 1: Amount */}
                        <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] space-y-5">
                            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[var(--primary-green)] text-white text-xs font-bold flex items-center justify-center">1</span>
                                Choose Amount
                            </h3>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5">
                                {SUGGESTED_DONATIONS.map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handlePreset(val)}
                                        className={cn(
                                            "py-3 rounded-xl font-bold text-sm border-2 transition-all",
                                            !isCustom && amount === val
                                                ? "border-[var(--primary-green)] bg-[var(--primary-green)] text-white shadow-lg shadow-[var(--primary-green)]/20"
                                                : "border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--primary-green)] hover:text-[var(--primary-green)]"
                                        )}
                                    >
                                        {val >= 1000 ? `${val / 1000}K` : val}
                                    </button>
                                ))}
                                <button
                                    onClick={() => { setIsCustom(true); setAmount(""); }}
                                    className={cn(
                                        "py-3 rounded-xl font-bold text-sm border-2 transition-all",
                                        isCustom
                                            ? "border-[var(--primary-green)] bg-[var(--primary-green)]/10 text-[var(--primary-green)]"
                                            : "border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--primary-green)]"
                                    )}
                                >
                                    Custom
                                </button>
                            </div>
                            {isCustom && (
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--text-muted)] text-sm">KES</span>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        className="w-full h-12 pl-14 pr-4 rounded-xl border-2 border-[var(--primary-green)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/20"
                                        autoFocus
                                        min={50}
                                    />
                                </div>
                            )}
                            {finalAmount > 0 && (
                                <div className="text-center py-2 rounded-lg bg-[var(--primary-green)]/5 border border-[var(--primary-green)]/20">
                                    <span className="text-2xl font-extrabold text-[var(--primary-green)] font-mono">
                                        {formatCurrency(finalAmount)}
                                    </span>
                                    <span className="text-xs text-[var(--text-muted)] ml-2">donated</span>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Payment Method */}
                        <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] space-y-4">
                            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[var(--primary-green)] text-white text-xs font-bold flex items-center justify-center">2</span>
                                Payment Method
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    { id: "mpesa", label: "M-Pesa", icon: Smartphone, desc: "Instant mobile payment" },
                                    { id: "card", label: "Card / Bank", icon: CreditCard, desc: "Visa, Mastercard, etc." },
                                ] as { id: PayMethod; label: string; icon: any; desc: string }[]).map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setPayMethod(opt.id)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 text-left transition-all",
                                            payMethod === opt.id
                                                ? "border-[var(--primary-green)] bg-[var(--primary-green)]/5"
                                                : "border-[var(--border-light)] hover:border-[var(--primary-green)]/50"
                                        )}
                                    >
                                        <opt.icon className={cn("w-6 h-6 mb-2", payMethod === opt.id ? "text-[var(--primary-green)]" : "text-[var(--text-muted)]")} />
                                        <div className="font-bold text-sm text-[var(--text-primary)]">{opt.label}</div>
                                        <div className="text-[10px] text-[var(--text-muted)]">{opt.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step 3: Your Info */}
                        <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] space-y-4">
                            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[var(--primary-green)] text-white text-xs font-bold flex items-center justify-center">3</span>
                                Your Information
                            </h3>

                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="w-4 h-4 accent-[var(--primary-green)]"
                                />
                                <span className="text-sm text-[var(--text-secondary)]">Donate anonymously</span>
                            </label>

                            {!isAnonymous && (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Your full name *"
                                        value={donorName}
                                        onChange={(e) => setDonorName(e.target.value)}
                                        className="w-full h-11 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30"
                                    />
                                </div>
                            )}

                            {payMethod === "mpesa" && (
                                <div className="flex gap-2">
                                    <div className="flex items-center px-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm font-bold text-[var(--text-muted)] shrink-0">+254</div>
                                    <input
                                        type="tel"
                                        placeholder="712 345 678 (M-Pesa number) *"
                                        value={donorPhone}
                                        onChange={(e) => setDonorPhone(e.target.value)}
                                        className="flex-1 h-11 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30"
                                    />
                                </div>
                            )}

                            <input
                                type="email"
                                placeholder="Email for receipt (optional)"
                                value={donorEmail}
                                onChange={(e) => setDonorEmail(e.target.value)}
                                className="w-full h-11 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30"
                            />

                            <textarea
                                placeholder="Leave an encouraging message (optional)"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={2}
                                maxLength={300}
                                className="w-full rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]/30 resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleDonate}
                            disabled={isLoading || finalAmount < 50}
                            className={cn(
                                "w-full h-16 rounded-2xl font-extrabold text-lg text-white transition-all flex items-center justify-center gap-3 shadow-xl",
                                isLoading || finalAmount < 50
                                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed shadow-none"
                                    : "bg-[var(--primary-green)] hover:brightness-110 shadow-[var(--primary-green)]/30 active:scale-[0.98]"
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Redirecting to payment...
                                </>
                            ) : (
                                <>
                                    <Heart className="w-5 h-5" />
                                    Donate {finalAmount ? formatCurrency(finalAmount) : "Now"}
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-[var(--text-muted)]">
                            <Lock className="w-3 h-3 inline mr-1" />
                            Payments processed securely by Flutterwave. Care Bridge Kenya never stores your card details.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

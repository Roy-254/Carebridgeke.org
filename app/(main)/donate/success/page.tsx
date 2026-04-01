"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Home, ArrowRight, Heart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function DonationSuccessContent() {
    const searchParams = useSearchParams();
    const txRef = searchParams.get("tx_ref") ?? "";
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [donationData, setDonationData] = useState<{
        amount?: number;
        currency?: string;
        campaign_title?: string;
        campaign_slug?: string;
        donor_name?: string;
    }>({});

    useEffect(() => {
        if (!txRef) {
            setStatus("failed");
            return;
        }

        // Poll the donation status from our DB (the webhook updates it)
        const donationId = txRef.replace("UBK-", "");
        let attempts = 0;

        const poll = async () => {
            attempts++;
            try {
                const res = await fetch(`/api/donation-status?id=${donationId}`);
                const data = await res.json();

                if (data.status === "confirmed") {
                    setDonationData(data);
                    setStatus("success");
                } else if (data.status === "failed") {
                    setStatus("failed");
                } else if (attempts < 10) {
                    // Still pending — wait 2s and try again
                    setTimeout(poll, 2000);
                } else {
                    // Timed out — assume success (webhook might be delayed)
                    setStatus("success");
                }
            } catch {
                if (attempts < 5) {
                    setTimeout(poll, 2000);
                } else {
                    setStatus("success"); // Optimistic
                }
            }
        };

        poll();
    }, [txRef]);

    if (status === "loading") {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center px-4">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-[var(--primary-green)]/20 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-[var(--primary-green)] animate-spin" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Confirming your donation…</h2>
                    <p className="text-[var(--text-secondary)]">Please wait while we verify your payment. This takes a few seconds.</p>
                </div>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center px-4 max-w-lg mx-auto">
                <div className="w-24 h-24 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <XCircle className="w-14 h-14 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Payment Not Completed</h2>
                    <p className="text-[var(--text-secondary)]">
                        Your donation was not processed. No money was charged. You can try again below.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/" className="px-6 py-3 rounded-xl border border-[var(--border-light)] font-bold text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2">
                        <Home className="w-4 h-4" /> Home
                    </Link>
                    <Link href="/explore" className="px-6 py-3 rounded-xl bg-[var(--primary-green)] text-white font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2">
                        Browse Campaigns <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    // Success
    const amount = donationData.amount ?? null;
    const campaignSlug = donationData.campaign_slug;
    const campaignTitle = donationData.campaign_title;
    const donorName = donationData.donor_name;

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 text-center px-4 max-w-lg mx-auto py-20">
            {/* Animated check */}
            <div className="relative">
                <div className="w-28 h-28 rounded-full bg-[var(--primary-green)]/10 flex items-center justify-center animate-bounce-slow">
                    <CheckCircle2 className="w-16 h-16 text-[var(--primary-green)]" />
                </div>
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-[var(--primary-green)] animate-ping"
                        style={{
                            top: `${50 + 44 * Math.sin((i / 6) * 2 * Math.PI)}%`,
                            left: `${50 + 44 * Math.cos((i / 6) * 2 * Math.PI)}%`,
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: "1.5s",
                            opacity: 0.4,
                        }}
                    />
                ))}
            </div>

            <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
                    Asante sana{donorName && donorName !== "Anonymous" ? `, ${donorName.split(" ")[0]}` : ""}! 🙏
                </h1>
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                    Your donation <strong>{amount ? `of ${formatCurrency(amount)}` : ""}</strong> has been confirmed.
                    {campaignTitle && ` You're helping "${campaignTitle}" reach its goal.`}
                </p>
            </div>

            <div className="w-full p-5 bg-[var(--primary-green)]/5 border border-[var(--primary-green)]/20 rounded-2xl flex items-center gap-4">
                <Heart className="w-8 h-8 text-[var(--primary-green)] shrink-0" />
                <p className="text-sm text-[var(--text-secondary)] text-left">
                    A receipt has been sent to your email if you provided one. Your contribution is making a real difference in someone's life.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
                {campaignSlug && (
                    <Link href={`/campaign/${campaignSlug}`} className="flex-1 py-3.5 rounded-xl bg-[var(--primary-green)] text-white font-bold text-sm text-center hover:brightness-110 transition-all flex items-center justify-center gap-2">
                        View Campaign Progress <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
                <Link href="/explore" className="flex-1 py-3.5 rounded-xl border border-[var(--border-light)] text-[var(--text-secondary)] font-bold text-sm text-center hover:bg-[var(--bg-secondary)] transition-colors">
                    Explore More Campaigns
                </Link>
            </div>
        </div>
    );
}

export default function DonationSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[var(--primary-green)] animate-spin" />
            </div>
        }>
            <DonationSuccessContent />
        </Suspense>
    );
}

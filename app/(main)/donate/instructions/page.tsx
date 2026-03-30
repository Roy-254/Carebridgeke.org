"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle2, Copy, Check, Phone, Mail, Home,
    ArrowRight, Loader2, AlertCircle,
} from "lucide-react";

// ─── Config (update once numbers are live) ─────────────────────
const PAYBILL = "123456";
const TILL = "4721832";
const WHATSAPP = "0740 797 404";
const SUPPORT_EMAIL = "donations@carebridgeke.org";
const SUPPORT_PHONE = "0740 797 404";

// ─── Copy-to-clipboard button ──────────────────────────────────
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    function copy() {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }
    return (
        <button
            onClick={copy}
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary-green)] hover:opacity-80 transition-opacity shrink-0 ml-2"
            title="Copy to clipboard"
        >
            {copied
                ? <><Check className="w-3.5 h-3.5" /> Copied!</>
                : <><Copy className="w-3.5 h-3.5" /> Copy</>
            }
        </button>
    );
}

// ─── Copyable row ──────────────────────────────────────────────
function CopyRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-[var(--border-light)] last:border-b-0">
            <span className="text-sm text-[var(--text-muted)]">{label}</span>
            <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-[var(--text-primary)] text-sm">{value}</span>
                <CopyButton text={value} />
            </div>
        </div>
    );
}

// ─── Inner component (needs useSearchParams) ───────────────────
function InstructionsContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code") ?? "";
    const isStk = searchParams.get("stk") === "true";
    const checkoutID = searchParams.get("checkoutID") ?? "";
    const amount = searchParams.get("amount") ?? "—";
    const email = searchParams.get("email") ?? "—";
    const phone = searchParams.get("phone") ?? "—";
    const supporting = searchParams.get("supporting") ?? "General Fund";

    const [activeTab, setActiveTab] = useState<"paybill" | "till">("paybill");
    const [resending, setResending] = useState(false);
    const [resendStatus, setResendStatus] = useState<"idle" | "sent" | "error">("idle");
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "confirmed" | "failed">("pending");

    const formattedAmount = new Intl.NumberFormat("en-KE", {
        style: "currency", currency: "KES", minimumFractionDigits: 0,
    }).format(Number(amount));

    // ── Polling for payment status ───────────────────────────
    useState(() => {
        if (!isStk && !code) return;

        const interval = setInterval(async () => {
            try {
                // We use our track API to check status
                const res = await fetch(`/api/track?code=${checkoutID || code}`);
                const data = await res.json();
                if (data.donation?.status === "confirmed") {
                    setPaymentStatus("confirmed");
                    clearInterval(interval);
                } else if (data.donation?.status === "failed") {
                    setPaymentStatus("failed");
                    clearInterval(interval);
                }
            } catch (e) {
                console.error("Polling error:", e);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    });

    async function resendEmail() {
        setResending(true);
        setResendStatus("idle");
        try {
            const res = await fetch("/api/donations/manual?code=" + encodeURIComponent(code));
            const data = await res.json();
            if (!res.ok || !data.donation) { setResendStatus("error"); return; }

            const d = data.donation;
            await fetch("/api/email/receipt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: d.donor_email,
                    donor_name: d.donor_name,
                    amount: d.amount,
                    currency: d.currency,
                    campaign_title: supporting,
                    confirmation_code: code,
                }),
            });
            setResendStatus("sent");
        } catch {
            setResendStatus("error");
        } finally {
            setResending(false);
        }
    }

    if (!code && !checkoutID) {
        return (
            <div className="max-w-lg mx-auto text-center py-20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Invalid Link</h2>
                <p className="text-[var(--text-secondary)] mb-6">No confirmation code found. Please complete the donation form first.</p>
                <Link href="/donate">
                    <button className="px-6 py-3 rounded-xl bg-[var(--primary-green)] text-white font-bold hover:brightness-110 transition-all">
                        Go to Donation Form
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-16">

            {/* ── STK Status / Confirmation card ──────────────────────── */}
            {isStk && paymentStatus === "pending" && (
                <div className="bg-[var(--primary-green)] text-white rounded-2xl p-8 text-center shadow-xl shadow-green-900/20 animate-pulse-slow">
                    <div className="relative w-16 h-16 mx-auto mb-5">
                        <Loader2 className="w-16 h-16 animate-spin opacity-20" />
                        <Phone className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h3 className="text-2xl font-extrabold mb-2">Check Your Phone!</h3>
                    <p className="text-green-50 text-sm leading-relaxed max-w-sm mx-auto">
                        An M-Pesa prompt has been sent to <strong>{phone}</strong>.<br />
                        Enter your M-Pesa PIN to complete the donation.
                    </p>
                </div>
            )}

            {paymentStatus === "confirmed" && (
                <div className="bg-green-500 text-white rounded-2xl p-8 text-center shadow-xl shadow-green-900/20 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-extrabold mb-2">Payment Confirmed!</h3>
                    <p className="text-green-50 mb-6">
                        Thank you! Your donation of <strong>{formattedAmount}</strong> has been received successfully.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/track" className="flex-1 sm:flex-none">
                            <button className="w-full px-8 py-3 rounded-xl bg-white text-green-600 font-extrabold hover:bg-green-50 transition-all">
                                View Your Impact
                            </button>
                        </Link>
                        <Link href="/" className="flex-1 sm:flex-none">
                            <button className="w-full px-8 py-3 rounded-xl bg-green-600 border border-green-400/30 text-white font-extrabold hover:bg-green-700 transition-all">
                                Home
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {paymentStatus === "failed" && (
                <div className="bg-red-500 text-white rounded-2xl p-8 text-center shadow-xl shadow-red-900/20">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-extrabold mb-2">Payment Failed</h3>
                    <p className="text-red-50 mb-4">
                        The M-Pesa transaction was cancelled or timed out.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 rounded-xl bg-white text-red-600 font-extrabold hover:bg-red-50 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* ── Confirmation code card (Only show if not confirmed) ── */}
            {paymentStatus !== "confirmed" && (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border-2 border-[var(--primary-green)]/30 p-6 text-center">
                    <CheckCircle2 className="w-10 h-10 text-[var(--primary-green)] mx-auto mb-3" />
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary-green)] mb-2">
                        {isStk ? "Tracking Details" : "Your Confirmation Code"}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <p className="font-mono text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-widest">
                            {code || "......"}
                        </p>
                        {code && <CopyButton text={code} />}
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-3">
                        Save this code — use it to track your donation at <span className="font-semibold text-[var(--primary-green)]">carebridgeke.org/track</span>. No account needed.
                    </p>
                </div>
            )}

            {/* ── Warning notice ──────────────────────────────── */}
            {paymentStatus !== "confirmed" && (
                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-700 dark:text-amber-300">
                        {isStk ? (
                            <p><strong>Didn't get the prompt?</strong> Ensure your phone is unlocked and try again. Alternatively, use the <strong>manual instructions</strong> below.</p>
                        ) : (
                            <p><strong>Note:</strong> Our M-Pesa numbers are being finalised. If the numbers below don't work,
                            check your email for the most up-to-date instructions, or WhatsApp us at <strong>{WHATSAPP}</strong>.</p>
                        )}
                    </div>
                </div>
            )}

            {/* ── Payment instructions ────────────────────────── */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
                <div className="px-6 pt-6 pb-0">
                    <h2 className="text-lg font-extrabold text-[var(--text-primary)] mb-4">
                        How to Complete Your Donation
                    </h2>
                    {/* Tabs */}
                    <div className="flex border-b border-[var(--border-light)]">
                        <button
                            onClick={() => setActiveTab("paybill")}
                            className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors ${activeTab === "paybill"
                                ? "border-[var(--primary-green)] text-[var(--primary-green)]"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                }`}
                        >
                            📱 Paybill <span className="text-xs font-normal ml-1 opacity-70">(Recommended)</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("till")}
                            className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors ${activeTab === "till"
                                ? "border-[var(--primary-green)] text-[var(--primary-green)]"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                }`}
                        >
                            📱 Till Number
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === "paybill" ? (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                                {[
                                    "Open M-Pesa on your phone",
                                    <span key="2">Select <strong>Lipa na M-Pesa</strong></span>,
                                    <span key="3">Select <strong>Paybill</strong></span>,
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2">
                                        <div className="w-6 h-6 rounded-full bg-[var(--primary-green)]/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-[var(--primary-green)]">{i + 1}</span>
                                        </div>
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] px-5 py-4 space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)] mb-2">Enter these details:</p>
                                <CopyRow label="Business Number" value={PAYBILL} />
                                <CopyRow label="Account Number (use YOUR code)" value={code} />
                                <CopyRow label="Amount (KES)" value={amount} />
                            </div>

                            <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                                {["Enter your M-Pesa PIN", "Confirm payment — done! ✅"].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2">
                                        <div className="w-6 h-6 rounded-full bg-[var(--primary-green)]/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-[var(--primary-green)]">{i + 4}</span>
                                        </div>
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                                {[
                                    "Open M-Pesa on your phone",
                                    <span key="2">Select <strong>Lipa na M-Pesa</strong></span>,
                                    <span key="3">Select <strong>Buy Goods and Services</strong></span>,
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2">
                                        <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{i + 1}</span>
                                        </div>
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] px-5 py-4 space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)] mb-2">Enter these details:</p>
                                <CopyRow label="Till Number" value={TILL} />
                                <CopyRow label="Amount (KES)" value={amount} />
                            </div>

                            <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                                {["Enter your M-Pesa PIN", "Confirm payment"].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2">
                                        <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{i + 4}</span>
                                        </div>
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
                                <p className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-1">⚠️ Important — Till payments only</p>
                                <p className="text-sm text-violet-600 dark:text-violet-400">
                                    After paying, please forward your M-Pesa SMS to WhatsApp:{" "}
                                    <strong>{WHATSAPP}</strong>{" "}
                                    and include your code: <span className="font-mono font-bold">{code}</span>.
                                    This lets us match and confirm your donation quickly.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── What happens next  ──────────────────────────── */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                <h2 className="font-extrabold text-[var(--text-primary)] mb-5">What Happens Next</h2>
                <div className="space-y-0">
                    {[
                        {
                            icon: "📧", when: "NOW", iconBg: "bg-green-100 dark:bg-green-900/30", iconColor: "text-green-700 dark:text-green-300",
                            desc: "You've received an email with these payment instructions.",
                        },
                        {
                            icon: "💳", when: "YOU — Complete M-Pesa", iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-700 dark:text-blue-300",
                            desc: "Follow the instructions above to send your donation.",
                        },
                        {
                            icon: "✅", when: "WITHIN 24 HOURS", iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-700 dark:text-amber-300",
                            desc: "We verify your payment and send an official receipt to your email.",
                        },
                        {
                            icon: "📊", when: "ONGOING", iconBg: "bg-violet-100 dark:bg-violet-900/30", iconColor: "text-violet-700 dark:text-violet-300",
                            desc: "Receive updates as your donation creates real impact on the ground.",
                        },
                    ].map(({ icon, when, iconBg, iconColor, desc }, i, arr) => (
                        <div key={when} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center text-lg shrink-0`}>
                                    {icon}
                                </div>
                                {i < arr.length - 1 && <div className="w-0.5 bg-[var(--border-light)] flex-1 my-1" />}
                            </div>
                            <div className="pb-6">
                                <p className={`text-xs font-bold uppercase tracking-widest ${iconColor} mb-0.5`}>{when}</p>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Donation summary ────────────────────────────── */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                <h2 className="font-extrabold text-[var(--text-primary)] mb-4">Your Donation Summary</h2>
                <div className="space-y-2">
                    <CopyRow label="Amount" value={formattedAmount} />
                    <div className="flex items-center justify-between py-2.5 border-b border-[var(--border-light)]">
                        <span className="text-sm text-[var(--text-muted)]">Supporting</span>
                        <span className="font-semibold text-[var(--text-primary)] text-sm text-right max-w-[55%] truncate">{supporting}</span>
                    </div>
                    <CopyRow label="Confirmation Code" value={code} />
                    <div className="flex items-center gap-2 py-2.5 border-b border-[var(--border-light)]">
                        <Mail className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                        <span className="text-sm text-[var(--text-muted)]">Sent to</span>
                        <span className="font-semibold text-[var(--text-primary)] text-sm ml-auto">{email}</span>
                    </div>
                    <div className="flex items-center gap-2 py-2.5">
                        <Phone className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                        <span className="text-sm text-[var(--text-muted)]">Phone</span>
                        <span className="font-semibold text-[var(--text-primary)] text-sm ml-auto font-mono">{phone}</span>
                    </div>
                </div>
            </div>

            {/* ── Bottom actions ───────────────────────────────── */}
            <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                    onClick={resendEmail}
                    disabled={resending}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[var(--border-medium)] text-[var(--text-secondary)] font-bold text-sm hover:border-[var(--primary-green)] hover:text-[var(--primary-green)] transition-all disabled:opacity-50"
                >
                    {resending
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Mail className="w-4 h-4" />
                    }
                    {resendStatus === "sent" ? "Email Sent! ✅" : resendStatus === "error" ? "Failed — try again" : "Resend Email"}
                </button>

                <a
                    href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}?text=Hi%2C+I+need+help+with+my+donation.+Code%3A+${code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[var(--border-medium)] text-[var(--text-secondary)] font-bold text-sm hover:border-green-500 hover:text-green-600 transition-all"
                >
                    <ArrowRight className="w-4 h-4" />
                    Need Help? WhatsApp Us
                </a>

                <Link href="/">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[var(--border-medium)] text-[var(--text-secondary)] font-bold text-sm hover:border-[var(--border-medium)] hover:text-[var(--text-primary)] transition-all">
                        <Home className="w-4 h-4" />
                        Back to Home
                    </button>
                </Link>
            </div>

            {/* Track CTA */}
            <div className="text-center py-4">
                <p className="text-sm text-[var(--text-muted)] mb-3">Want to check on your donation later?</p>
                <Link href={`/track?code=${code}`}>
                    <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] font-bold text-sm hover:border-[var(--primary-green)] hover:text-[var(--primary-green)] transition-all">
                        Track Donation <ArrowRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────
export default function InstructionsPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-14 border-b border-[var(--border-light)]">
                <div className="container-custom text-center max-w-2xl">
                    <div className="w-16 h-16 rounded-full bg-[var(--primary-green)]/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-[var(--primary-green)]" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-3 leading-tight">
                        Payment Instructions Ready!
                    </h1>
                    <p className="text-[var(--text-secondary)] text-lg">
                        Complete your donation via M-Pesa using the steps below.
                        A copy has been sent to your email.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-10 md:py-14">
                <div className="container-custom">
                    <Suspense fallback={
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-green)]" />
                        </div>
                    }>
                        <InstructionsContent />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}

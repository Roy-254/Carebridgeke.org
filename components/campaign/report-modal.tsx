"use client";

import { useState } from "react";
import { AlertCircle, X, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const REPORT_REASONS = [
    { value: "fraud", label: "Fraud or scam — I believe this campaign is fraudulent" },
    { value: "misleading", label: "Misleading information — Story doesn't seem accurate" },
    { value: "inappropriate", label: "Inappropriate content — Violates community standards" },
    { value: "duplicate", label: "Duplicate campaign — Another campaign exists for this" },
    { value: "other", label: "Other reason" },
];

interface ReportModalProps {
    campaignId: string;
    campaignTitle: string;
    onClose: () => void;
}

export function ReportModal({ campaignId, campaignTitle, onClose }: ReportModalProps) {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!reason) {
            setError("Please select a reason for reporting.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();

            const { error: dbError } = await supabase.from("reports").insert({
                campaign_id: campaignId,
                reason,
                details: details.trim() || null,
            });

            if (dbError) throw dbError;
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || "Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border-light)] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-light)]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-[var(--text-primary)] text-base">Report Campaign</h2>
                            <p className="text-xs text-[var(--text-muted)] truncate max-w-[220px]">{campaignTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {submitted ? (
                        <div className="py-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
                                <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-[var(--text-primary)] text-lg">Report Submitted</h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">
                                    Thank you for helping keep Unity Bridge Kenya safe. Our team will review this campaign within 24–48 hours.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="mt-4 px-6 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <p className="text-xs font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--text-primary)]">
                                    Why are you reporting this campaign? *
                                </label>
                                <div className="space-y-2">
                                    {REPORT_REASONS.map((r) => (
                                        <label
                                            key={r.value}
                                            className={cn(
                                                "flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all",
                                                reason === r.value
                                                    ? "border-red-400 bg-red-50 dark:bg-red-900/10"
                                                    : "border-[var(--border-light)] hover:border-red-300 hover:bg-[var(--bg-secondary)]"
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="report_reason"
                                                value={r.value}
                                                checked={reason === r.value}
                                                onChange={() => setReason(r.value)}
                                                className="mt-0.5 accent-red-500"
                                            />
                                            <span className="text-sm text-[var(--text-secondary)] leading-snug">
                                                {r.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--text-primary)]">
                                    Additional details <span className="text-[var(--text-muted)] font-normal">(optional)</span>
                                </label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="Please add any additional context that would help our team investigate..."
                                    rows={3}
                                    maxLength={500}
                                    className="w-full rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-red-400/30 resize-none"
                                />
                                <p className="text-[10px] text-[var(--text-muted)] text-right">{details.length}/500</p>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !reason}
                                className={cn(
                                    "w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                                    isSubmitting || !reason
                                        ? "bg-gray-200 dark:bg-gray-800 text-[var(--text-muted)] cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                                )}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Report
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-[var(--text-muted)]">
                                False reports may result in account restrictions. Only report genuine concerns.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

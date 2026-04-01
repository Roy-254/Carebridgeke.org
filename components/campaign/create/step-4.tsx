"use client";

import React, { useState } from "react";
import {
    Edit2,
    MapPin,
    Users,
    Calendar,
    CheckCircle2,
    Shield,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCampaign } from "@/context/campaign-context";
import { CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Step4Review() {
    const { campaignDraft, setStep, updateDraft, submitCampaign, isSubmitting } = useCampaign();
    const [previews, setPreviews] = useState<string[]>(
        campaignDraft.images.map(img => URL.createObjectURL(img))
    );

    return (
        <div className="space-y-10 animate-slide-up pb-20">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Review your campaign</h2>
                <p className="text-[var(--text-secondary)]">Check everything before submitting for review. You can edit any section.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-8">
                    {/* Header Summary */}
                    <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border-light)] relative group">
                        <button
                            onClick={() => setStep(1)}
                            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-white z-10 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>

                        <div className="aspect-video relative">
                            {previews[0] ? (
                                <img src={previews[0]} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[var(--text-muted)]">
                                    No image selected
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="inline-block px-3 py-1 bg-[var(--primary-green)] text-[10px] font-bold rounded-full mb-3 uppercase tracking-wider">
                                    {CATEGORY_LABELS[campaignDraft.category as keyof typeof CATEGORY_LABELS] || campaignDraft.category}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-bold">{campaignDraft.title || "Untitled Campaign"}</h3>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Goal</p>
                                <p className="font-bold text-[var(--text-primary)] font-mono">KES {campaignDraft.targetAmount.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Location</p>
                                <p className="font-bold text-[var(--text-primary)]">{campaignDraft.county}, {campaignDraft.town}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Beneficiary</p>
                                <p className="font-bold text-[var(--text-primary)]">{campaignDraft.beneficiaryName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Deadline</p>
                                <p className="font-bold text-[var(--text-primary)]">
                                    {campaignDraft.noDeadline ? "Ongoing" : campaignDraft.endDate?.toLocaleDateString() || "Not set"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Story Preview */}
                    <div className="bg-[var(--bg-primary)] p-8 rounded-2xl border border-[var(--border-light)] relative">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-[var(--text-primary)]">The Story</h4>
                            <button onClick={() => setStep(2)} className="p-2 text-[var(--primary-green)] hover:bg-[var(--primary-green)]/5 rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="prose dark:prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                            {campaignDraft.story || "No story provided yet."}
                        </div>

                        {previews.length > 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                {previews.slice(1).map((src, i) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-[var(--border-light)]">
                                        <img src={src} alt="Campaign thumbnail" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Verification Status */}
                    <div className="bg-[var(--bg-primary)] p-6 rounded-2xl border border-[var(--border-light)]">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-[var(--text-primary)]">Verification</h4>
                            <button onClick={() => setStep(3)} className="text-[var(--primary-green)] text-xs font-bold hover:underline">Edit</button>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                {campaignDraft.idDocumentFront ? (
                                    <CheckCircle2 className="w-4 h-4 text-[var(--primary-green)]" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border border-red-400" />
                                )}
                                ID Verification Document
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                {(campaignDraft.supportingDocs?.length ?? 0) > 0 ? (
                                    <CheckCircle2 className="w-4 h-4 text-[var(--primary-green)]" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border border-red-400" />
                                )}
                                Supporting Evidence
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                {campaignDraft.paymentMethods.length > 0 ? (
                                    <CheckCircle2 className="w-4 h-4 text-[var(--primary-green)]" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border border-red-400" />
                                )}
                                Withdrawal Payment Method
                            </li>
                        </ul>
                    </div>

                    {/* Terms & Actions */}
                    <div className="bg-[var(--bg-primary)] p-6 rounded-2xl border border-[var(--border-light)] space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="accurate"
                                    className="mt-1 accent-[var(--primary-green)]"
                                    checked={campaignDraft.accurateInfo}
                                    onChange={(e) => updateDraft({ accurateInfo: e.target.checked })}
                                />
                                <label htmlFor="accurate" className="text-xs text-[var(--text-secondary)]">I confirm all information is accurate</label>
                            </div>
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="tos"
                                    className="mt-1 accent-[var(--primary-green)]"
                                    checked={campaignDraft.agreedToTerms}
                                    onChange={(e) => updateDraft({ agreedToTerms: e.target.checked })}
                                />
                                <label htmlFor="tos" className="text-xs text-[var(--text-secondary)]">I agree to Unity Bridge Kenya <button className="text-[var(--primary-green)] font-bold">Terms of Service</button></label>
                            </div>
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="fee"
                                    className="mt-1 accent-[var(--primary-green)]"
                                    checked={campaignDraft.understandFee}
                                    onChange={(e) => updateDraft({ understandFee: e.target.checked })}
                                />
                                <label htmlFor="fee" className="text-xs text-[var(--text-secondary)]">I understand the 5% platform fee</label>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            className="w-full h-14 text-lg font-bold"
                            onClick={submitCampaign}
                            disabled={isSubmitting || !campaignDraft.accurateInfo || !campaignDraft.agreedToTerms || !campaignDraft.understandFee}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Campaign for Review"}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                            <Shield className="w-3 h-3 text-blue-500" />
                            Secure Submission
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

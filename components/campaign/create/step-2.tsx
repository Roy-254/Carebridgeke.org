"use client";

import React, { useRef } from "react";
import {
    Video, Upload, X, Bold, Italic, List, ListOrdered, Trash2, CheckCircle2, Lightbulb, ImageIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCampaign } from "@/context/campaign-context";
import { cn } from "@/lib/utils";
import { MAX_CAMPAIGN_IMAGES, MAX_IMAGE_SIZE, ALLOWED_IMAGE_FORMATS } from "@/lib/constants";

const TIPS = [
    "Use a clear, recent photo of the beneficiary",
    "Explain the situation with specific details",
    "State exactly how funds will be used",
    "Include a timeline or milestones",
    "Personal stories get 3× more donations",
    "Share regular updates with donors",
];

export function Step2Story() {
    const { campaignDraft, updateDraft } = useCampaign();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const incoming = Array.from(e.target.files || []);
        const valid = incoming.filter(f => {
            if (!ALLOWED_IMAGE_FORMATS.includes(f.type)) return false;
            if (f.size > MAX_IMAGE_SIZE) return false;
            return true;
        });

        const combined = [...campaignDraft.images, ...valid].slice(0, MAX_CAMPAIGN_IMAGES);
        const previews = combined.map(f => URL.createObjectURL(f));
        updateDraft({ images: combined, imagePreviewUrls: previews });

        // Reset input so same file can be re-added after removal
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index: number) => {
        const newImages = campaignDraft.images.filter((_, i) => i !== index);
        const newPreviews = campaignDraft.imagePreviewUrls.filter((_, i) => i !== index);
        updateDraft({ images: newImages, imagePreviewUrls: newPreviews });
    };

    const previews = campaignDraft.imagePreviewUrls;
    const charCount = campaignDraft.story.length;

    return (
        <div className="flex flex-col lg:flex-row gap-10 animate-slide-up">
            <div className="flex-1 space-y-10">

                {/* Header */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Share your story</h2>
                    <p className="text-[var(--text-secondary)]">Help donors understand why you need support and the impact their contribution will make.</p>
                </div>

                {/* Story textarea */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="story">Campaign Story <span className="text-red-500">*</span></Label>
                        <span className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                            charCount < 100
                                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                : charCount < 300
                                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                                    : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        )}>
                            {charCount} chars {charCount < 100 ? `(${100 - charCount} more needed)` : "✓"}
                        </span>
                    </div>

                    <div className="border border-[var(--border-light)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--primary-green)] focus-within:border-transparent transition-all">
                        {/* Formatting Bar (cosmetic for now) */}
                        <div className="flex items-center gap-1 p-2 bg-[var(--bg-secondary)] border-b border-[var(--border-light)]">
                            <button type="button" className="p-1.5 rounded hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors"><Bold className="w-4 h-4" /></button>
                            <button type="button" className="p-1.5 rounded hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors"><Italic className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-[var(--border-light)] mx-1" />
                            <button type="button" className="p-1.5 rounded hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors"><ListOrdered className="w-4 h-4" /></button>
                            <button type="button" className="p-1.5 rounded hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors"><List className="w-4 h-4" /></button>
                        </div>
                        <textarea
                            id="story"
                            className="w-full min-h-[300px] p-4 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none leading-relaxed"
                            placeholder={`Tell donors:
• Who you are and who you're raising funds for
• What happened and why you need help
• How the money will specifically be used
• What impact their donation will make
• Any timeline or deadlines involved

Be genuine — real stories connect with real people.`}
                            value={campaignDraft.story}
                            onChange={(e) => updateDraft({ story: e.target.value })}
                        />
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Campaign Photos <span className="text-[var(--text-muted)] text-xs font-normal">(up to {MAX_CAMPAIGN_IMAGES} photos)</span></Label>
                        {previews.length > 0 && (
                            <span className="text-xs text-[var(--text-muted)]">{previews.length} / {MAX_CAMPAIGN_IMAGES} uploaded</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {previews.map((src, i) => (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-[var(--border-light)] shadow-sm">
                                <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                {i === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-[var(--primary-green)] text-white text-[9px] font-bold text-center py-1 tracking-widest uppercase">
                                        Cover
                                    </div>
                                )}
                            </div>
                        ))}

                        {previews.length < MAX_CAMPAIGN_IMAGES && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-lg border-2 border-dashed border-[var(--border-light)] hover:border-[var(--primary-green)] hover:bg-[var(--primary-green)]/5 transition-all flex flex-col items-center justify-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--primary-green)]"
                            >
                                <Upload className="w-6 h-6" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Add Photo</span>
                            </button>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept={ALLOWED_IMAGE_FORMATS.join(",")}
                            onChange={handleFileChange}
                        />
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">
                        JPG, PNG, WebP — max 5MB each. First photo is your cover image. Clear, well-lit photos dramatically improve donations.
                    </p>
                </div>

                {/* Video URL */}
                <div className="space-y-2">
                    <Label htmlFor="video">Campaign Video <span className="text-[var(--text-muted)] text-xs font-normal">(Optional)</span></Label>
                    <div className="relative">
                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            id="video"
                            type="url"
                            placeholder="YouTube or Vimeo link e.g. https://youtu.be/..."
                            value={campaignDraft.videoUrl || ""}
                            onChange={(e) => updateDraft({ videoUrl: e.target.value })}
                            className="w-full h-11 pl-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                        />
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">Video increases trust and donation rates significantly.</p>
                </div>
            </div>

            {/* Tips Sidebar */}
            <aside className="hidden xl:block w-72 h-fit sticky top-24 p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]">
                <h4 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Tips for a Successful Campaign
                </h4>
                <ul className="space-y-3.5">
                    {TIPS.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                            <CheckCircle2 className="w-4 h-4 text-[var(--primary-green)] shrink-0 mt-0.5" />
                            {tip}
                        </li>
                    ))}
                </ul>
                <div className="mt-8 p-4 bg-[var(--primary-green)]/10 rounded-xl border border-[var(--primary-green)]/20">
                    <p className="text-xs font-medium text-[var(--primary-green)] leading-relaxed">
                        Campaigns with <b>3+ photos</b> and a story over <b>300 characters</b> raise <b>75% more</b> on average.
                    </p>
                </div>
            </aside>
        </div>
    );
}

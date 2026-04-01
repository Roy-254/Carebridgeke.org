"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Users, MapPin, Calendar, ChevronLeft, Share2,
    AlertCircle, ShieldCheck,
    MoreVertical, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, shareOnWhatsApp, shareOnFacebook } from "@/lib/utils";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ReportModal } from "@/components/campaign/report-modal";

interface Campaign {
    id: string;
    title: string;
    slug: string;
    category: string;
    county?: string;
    story: string;
    current_amount: number;
    target_amount: number;
    deadline?: string;
    created_at: string;
    view_count?: number;
    is_verified?: boolean;
    creator?: {
        id: string;
        full_name: string;
        is_verified: boolean;
        avatar_url?: string;
        county?: string;
    };
    images?: { storage_url: string; order_index: number }[];
    documents?: { id: string; file_name: string; file_size?: number; doc_type?: string }[];
    updates?: { id: string; title: string; content: string; created_at: string }[];
    donations?: {
        id: string;
        donor_name?: string;
        amount: number;
        message?: string;
        is_anonymous: boolean;
        created_at: string;
        status: string;
    }[];
}


export function CampaignDetailClient({ campaign }: { campaign: Campaign }) {
    const router = useRouter();
    const [activeImage, setActiveImage] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const sortedImages = [...(campaign.images ?? [])].sort((a, b) => a.order_index - b.order_index);
    const campaignUrl = typeof window !== "undefined"
        ? `${window.location.origin}/campaign/${campaign.slug}`
        : `/campaign/${campaign.slug}`;

    const handleShare = (platform: string) => {
        const text = `Help ${campaign.title} reach its goal on Unity Bridge Kenya!`;
        if (platform === "whatsapp") shareOnWhatsApp(text, campaignUrl);
        if (platform === "facebook") shareOnFacebook(campaignUrl);
        if (platform === "copy") {
            navigator.clipboard.writeText(campaignUrl);
            setShowShareMenu(false);
        }
    };

    const categoryLabel = CATEGORY_LABELS[campaign.category as keyof typeof CATEGORY_LABELS] ?? campaign.category;
    const categoryColor = CATEGORY_COLORS[campaign.category as keyof typeof CATEGORY_COLORS] ?? "bg-gray-100 text-gray-700";

    return (
        <>
            {/* Breadcrumb */}
            <div className="border-b border-[var(--border-light)] py-4 bg-[var(--bg-primary)]">
                <div className="container-custom flex items-center justify-between">
                    <Link href="/explore" className="flex items-center gap-1.5 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--primary-green)] transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Campaigns
                    </Link>
                    <div className="flex items-center gap-2 relative">
                        <Button
                            variant="outline" size="sm"
                            className="h-9 gap-2"
                            onClick={() => setShowShareMenu(!showShareMenu)}
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                        {showShareMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl shadow-2xl z-50 overflow-hidden">
                                {[
                                    { id: "whatsapp", label: "Share on WhatsApp", emoji: "💬" },
                                    { id: "facebook", label: "Share on Facebook", emoji: "📘" },
                                    { id: "copy", label: "Copy Link", emoji: "🔗" },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleShare(opt.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors text-left"
                                    >
                                        <span className="text-base">{opt.emoji}</span>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container-custom py-10">
                <div className="flex flex-col xl:flex-row gap-12">

                    {/* ── Left Column ── */}
                    <div className="flex-1 space-y-10">

                        {/* Category + Title */}
                        <div className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${categoryColor}`}>
                                    {categoryLabel}
                                </span>
                                <span className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)]">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(campaign.created_at)}
                                </span>
                                {campaign.view_count && (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)]">
                                        <Eye className="w-3.5 h-3.5" />
                                        {campaign.view_count.toLocaleString()} views
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] leading-tight">
                                {campaign.title}
                            </h1>
                        </div>

                        {/* Image Gallery */}
                        {sortedImages.length > 0 && (
                            <div className="space-y-3">
                                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[var(--border-light)] shadow-xl">
                                    <Image
                                        src={sortedImages[activeImage]?.storage_url}
                                        alt={campaign.title}
                                        fill
                                        className="object-cover"
                                        priority
                                        unoptimized
                                    />
                                </div>
                                {sortedImages.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                                        {sortedImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImage(idx)}
                                                className={cn(
                                                    "relative w-24 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                                                    activeImage === idx
                                                        ? "border-[var(--primary-green)] ring-2 ring-[var(--primary-green)]/20"
                                                        : "border-transparent opacity-60 hover:opacity-100"
                                                )}
                                            >
                                                <Image src={img.storage_url} alt={`Thumb ${idx}`} fill className="object-cover" unoptimized />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* Initiative Story */}
                        <div className="space-y-6">
                            {campaign.story.split("\n").filter((p: string) => p.trim()).map((para: string, i: number) => (
                                <p key={i} className="text-[var(--text-secondary)] text-lg leading-relaxed">
                                    {para.trim()}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* ── Right Column: Sticky ── */}
                    <div className="xl:w-[400px]">
                        <div className="sticky top-24 space-y-6">
                            {/* Donation Card */}
                            <Card className="border-2 border-[var(--primary-green)]/10 shadow-2xl overflow-hidden">
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)]">Support this Project</h3>
                                        <p className="text-sm text-[var(--text-secondary)]">Your contribution directly funds this initiative.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            size="lg"
                                            className="w-full h-14 text-lg font-bold shadow-green-500/20 shadow-xl"
                                            onClick={() => router.push(`/donate/${campaign.slug}`)}
                                        >
                                            Donate Now 🤝
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="w-full h-12 font-bold"
                                            onClick={() => handleShare("whatsapp")}
                                        >
                                            <Share2 className="w-5 h-5 mr-2" />
                                            Share on WhatsApp
                                        </Button>
                                    </div>

                                    {/* Deadlines removed */}
                                </CardContent>

                                <div className="px-8 py-4 bg-[var(--bg-secondary)] border-t border-[var(--border-light)] flex items-center justify-center gap-6">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-muted)] uppercase">
                                        <ShieldCheck className="w-4 h-4 text-blue-500" /> Secure
                                    </div>
                                    <div className="w-px h-4 bg-[var(--border-light)]" />
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-muted)] uppercase">
                                        <Users className="w-4 h-4 text-[var(--primary-green)]" /> Verified
                                    </div>
                                    <div className="w-px h-4 bg-[var(--border-light)]" />
                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-muted)] uppercase hover:text-red-500 transition-colors"
                                    >
                                        <AlertCircle className="w-4 h-4" /> Report
                                    </button>
                                </div>
                            </Card>

                            {showReportModal && (
                                <ReportModal
                                    campaignId={campaign.id}
                                    campaignTitle={campaign.title}
                                    onClose={() => setShowReportModal(false)}
                                />
                            )}


                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}


"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/constants";
import { Campaign } from "@/types";

interface CampaignCardProps {
    campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
    const percentage = calculatePercentage(campaign.current_amount, campaign.target_amount);

    return (
        <Link href={`/campaign/${campaign.slug}`} className="block h-full">
            <Card className="h-full overflow-hidden group border-[var(--border-light)] hover:border-[var(--primary-green)]/30">
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={campaign.images[0] || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800"}
                        alt={campaign.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {campaign.is_urgent && (
                        <div className="absolute top-3 right-3 bg-[var(--primary-red)] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse">
                            Urgent
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-tight">
                        <MapPin className="w-3 h-3 text-[var(--primary-green)]" />
                        {campaign.county || "Kenya"}
                    </div>
                </div>

                <CardContent className="p-5 flex flex-col justify-between h-[calc(100%-12rem)]">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[campaign.category as keyof typeof CATEGORY_COLORS] || ""}`}>
                                {CATEGORY_LABELS[campaign.category as keyof typeof CATEGORY_LABELS] || campaign.category}
                            </span>
                        </div>

                        <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 line-clamp-2 leading-tight group-hover:text-[var(--primary-green)] transition-colors">
                            {campaign.title}
                        </h3>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold uppercase tracking-tighter text-[var(--text-secondary)]">
                                <span>{percentage}% Raised</span>
                                <span className="text-[var(--text-primary)]">{formatCurrency(campaign.current_amount)}</span>
                            </div>
                            <ProgressBar current={campaign.current_amount} target={campaign.target_amount} size="sm" />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-light)]/50">
                            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                <Users className="w-4 h-4 text-[var(--primary-green)]" />
                                <span className="text-xs font-bold">{campaign.view_count || 0} supporters</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                <Clock className="w-4 h-4 text-[var(--primary-red)]" />
                                <span className="text-xs font-bold">12 days left</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

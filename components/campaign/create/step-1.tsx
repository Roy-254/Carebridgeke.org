"use client";

import React from "react";
import {
    Stethoscope,
    GraduationCap,
    AlertCircle,
    Building2,
    Lightbulb,
    Check
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCampaign } from "@/context/campaign-context";
import { KENYAN_COUNTIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    {
        id: "medical",
        title: "Medical Bills",
        description: "Hospital bills, treatment, surgery",
        icon: Stethoscope,
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
    {
        id: "education",
        title: "School Fees",
        description: "Tuition, books, uniforms, exams",
        icon: GraduationCap,
        color: "text-purple-500",
        bg: "bg-purple-50"
    },
    {
        id: "emergency",
        title: "Emergency Relief",
        description: "Urgent unexpected situations",
        icon: AlertCircle,
        color: "text-red-500",
        bg: "bg-red-50"
    },
    {
        id: "community",
        title: "Community Project",
        description: "Projects for the community",
        icon: Building2,
        color: "text-green-500",
        bg: "bg-green-50"
    },
    {
        id: "other",
        title: "Other",
        description: "Anything else that needs support",
        icon: Lightbulb,
        color: "text-orange-500",
        bg: "bg-orange-50"
    }
];

const RELATIONSHIPS = [
    "Myself", "Child", "Parent", "Sibling", "Friend", "Community Member", "Other"
];

export function Step1Basics() {
    const { campaignDraft, updateDraft } = useCampaign();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/,/g, "");
        if (val === "" || /^\d+$/.test(val)) {
            updateDraft({ targetAmount: val === "" ? 0 : parseInt(val) });
        }
    };

    const formattedAmount = campaignDraft.targetAmount > 0
        ? campaignDraft.targetAmount.toLocaleString()
        : "";

    return (
        <div className="space-y-10 animate-slide-up">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Let's start with the basics</h2>
                <p className="text-[var(--text-secondary)]">Tell us what you're raising funds for and how much you need.</p>
            </div>

            {/* Campaign Title */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="title">Campaign Title</Label>
                    <span className="text-xs text-[var(--text-muted)]">
                        {campaignDraft.title.length}/100
                    </span>
                </div>
                <Input
                    id="title"
                    placeholder="e.g. Help John complete secondary school"
                    value={campaignDraft.title}
                    onChange={(e) => updateDraft({ title: e.target.value.substring(0, 100) })}
                    className="h-12 text-lg"
                />
            </div>

            {/* Category Selection */}
            <div className="space-y-4">
                <Label>Category</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateDraft({ category: cat.id })}
                            className={cn(
                                "flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all hover:bg-[var(--bg-secondary)]",
                                campaignDraft.category === cat.id
                                    ? "border-[var(--primary-green)] bg-[var(--primary-green)]/5"
                                    : "border-[var(--border-light)]"
                            )}
                        >
                            <div className={cn("p-2 rounded-lg mb-3 shadow-sm", cat.bg)}>
                                <cat.icon className={cn("w-6 h-6", cat.color)} />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-[var(--text-primary)]">{cat.title}</span>
                                {campaignDraft.category === cat.id && <Check className="w-4 h-4 text-[var(--primary-green)]" />}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-tight">{cat.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Goal and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <Label htmlFor="goal">Fundraising Goal</Label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--text-muted)]">
                            KES
                        </div>
                        <Input
                            id="goal"
                            placeholder="50,000"
                            value={formattedAmount}
                            onChange={handleAmountChange}
                            className="pl-14 h-12 text-xl font-bold font-mono"
                        />
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">You can always edit this later</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate text-sm">Campaign End Date (Optional)</Label>
                    <Input
                        id="endDate"
                        type="date"
                        disabled={campaignDraft.noDeadline}
                        className="h-12"
                        onChange={(e) => updateDraft({ endDate: new Date(e.target.value) })}
                    />
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="checkbox"
                            id="noDeadline"
                            checked={campaignDraft.noDeadline}
                            onChange={(e) => updateDraft({ noDeadline: e.target.checked })}
                            className="accent-[var(--primary-green)]"
                        />
                        <label htmlFor="noDeadline" className="text-xs text-[var(--text-secondary)] cursor-pointer">
                            No deadline (keep it open)
                        </label>
                    </div>
                </div>
            </div>

            {/* Beneficiary */}
            <div className="space-y-4 pt-6 border-t border-[var(--border-light)]">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Beneficiary Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="beneficiaryName">Beneficiary Full Name</Label>
                        <Input
                            id="beneficiaryName"
                            placeholder="Full name of person receiving funds"
                            value={campaignDraft.beneficiaryName}
                            onChange={(e) => updateDraft({ beneficiaryName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="relationship">Relationship</Label>
                        <select
                            id="relationship"
                            className="flex h-11 w-full rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-green)]"
                            value={campaignDraft.relationship}
                            onChange={(e) => updateDraft({ relationship: e.target.value })}
                        >
                            <option value="">Select relationship</option>
                            {RELATIONSHIPS.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="space-y-4 pt-6 border-t border-[var(--border-light)]">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="county">County</Label>
                        <select
                            id="county"
                            className="flex h-11 w-full rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-green)]"
                            value={campaignDraft.county}
                            onChange={(e) => updateDraft({ county: e.target.value })}
                        >
                            <option value="">Select County</option>
                            {KENYAN_COUNTIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="town">Town / City</Label>
                        <Input
                            id="town"
                            placeholder="e.g. Westlands, Nairobi"
                            value={campaignDraft.town}
                            onChange={(e) => updateDraft({ town: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

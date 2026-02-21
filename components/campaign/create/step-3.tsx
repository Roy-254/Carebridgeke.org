"use client";

import React, { useRef, useState } from "react";
import {
    ShieldCheck, Upload, X, Info, Lock, FileText, BadgeCheck,
    Smartphone, Building2, CreditCard, DollarSign, ChevronDown, ChevronUp, Plus, Check
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCampaign, PaymentMethod, PaymentMethodType } from "@/context/campaign-context";
import { cn } from "@/lib/utils";

const KENYAN_BANKS = [
    "KCB Bank", "Equity Bank", "Co-operative Bank", "Absa Bank Kenya",
    "Standard Chartered Kenya", "NCBA Bank", "DTB Bank", "I&M Bank",
    "Stanbic Bank", "Prime Bank", "Bank of Africa", "Family Bank",
    "National Bank of Kenya", "Diamond Trust Bank", "SBM Bank Kenya",
    "Gulf African Bank", "HF Group", "Consolidated Bank",
];

const PAYMENT_OPTIONS: { type: PaymentMethodType; label: string; description: string; icon: React.ElementType; color: string }[] = [
    { type: "mpesa_personal", label: "M-Pesa (Personal)", description: "Receive to your Safaricom number", icon: Smartphone, color: "text-green-600" },
    { type: "mpesa_paybill", label: "M-Pesa Paybill", description: "Receive to a business paybill", icon: Building2, color: "text-green-700" },
    { type: "mpesa_till", label: "M-Pesa Till Number", description: "Receive to a buy-goods till", icon: Smartphone, color: "text-green-500" },
    { type: "bank", label: "Bank Account", description: "Direct bank transfer (3-5 days)", icon: CreditCard, color: "text-blue-600" },
    { type: "paypal", label: "PayPal", description: "International transfers", icon: DollarSign, color: "text-indigo-600" },
];

function DocUploadBox({
    label, file, onUpload, onRemove, accept
}: {
    label: string; file?: File; onUpload: (f: File) => void; onRemove: () => void; accept?: string;
}) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {!file ? (
                <button
                    type="button"
                    onClick={() => ref.current?.click()}
                    className="w-full py-8 rounded-xl border-2 border-dashed border-[var(--border-light)] hover:border-[var(--primary-green)] hover:bg-[var(--primary-green)]/5 transition-all flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] group"
                >
                    <Upload className="w-7 h-7 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wider">Click to upload</span>
                    <span className="text-[10px] text-[var(--text-muted)]">PDF, JPG, PNG (max 10MB)</span>
                </button>
            ) : (
                <div className="relative px-4 py-6 rounded-xl border border-[var(--primary-green)] bg-[var(--primary-green)]/5 flex items-center gap-3">
                    <BadgeCheck className="w-8 h-8 text-[var(--primary-green)] shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--text-primary)] truncate">{file.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shrink-0"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
            <input
                type="file"
                ref={ref}
                className="hidden"
                accept={accept ?? "image/*,application/pdf"}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
            />
        </div>
    );
}

function PaymentMethodForm({ method, onChange, onRemove }: {
    method: PaymentMethod;
    onChange: (m: PaymentMethod) => void;
    onRemove: () => void;
}) {
    const update = (fields: Partial<PaymentMethod>) => onChange({ ...method, ...fields });

    return (
        <div className="p-5 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                    {PAYMENT_OPTIONS.find(p => p.type === method.type)?.label}
                </span>
                <button type="button" onClick={onRemove} className="p-1 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {method.type === "mpesa_personal" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor={`mpesa-num-${method.type}`}>M-Pesa Phone Number</Label>
                        <div className="flex gap-2">
                            <div className="flex items-center px-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-md text-sm font-medium shrink-0">+254</div>
                            <input
                                id={`mpesa-num-${method.type}`}
                                placeholder="712345678"
                                value={method.mpesa_number?.replace(/^\+254/, "") ?? ""}
                                onChange={(e) => update({ mpesa_number: "+254" + e.target.value.replace(/^0/, "") })}
                                className="flex-1 h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Registered Name</Label>
                        <input
                            placeholder="Name on M-Pesa"
                            value={method.mpesa_name ?? ""}
                            onChange={(e) => update({ mpesa_name: e.target.value })}
                            className="w-full h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                        />
                    </div>
                </div>
            )}

            {method.type === "mpesa_paybill" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Paybill Number</Label>
                        <input
                            placeholder="e.g. 247247"
                            value={method.paybill_number ?? ""}
                            onChange={(e) => update({ paybill_number: e.target.value })}
                            className="w-full h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Account Number</Label>
                        <input
                            placeholder="Your account number"
                            value={method.paybill_account ?? ""}
                            onChange={(e) => update({ paybill_account: e.target.value })}
                            className="w-full h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                        />
                    </div>
                </div>
            )}

            {method.type === "mpesa_till" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Till Number</Label>
                        <input
                            placeholder="e.g. 123456"
                            value={method.till_number ?? ""}
                            onChange={(e) => update({ till_number: e.target.value })}
                            className="w-full h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Business / Registered Name</Label>
                        <input
                            placeholder="Name registered to till"
                            value={method.till_name ?? ""}
                            onChange={(e) => update({ till_name: e.target.value })}
                            className="w-full h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                        />
                    </div>
                </div>
            )}

            {method.type === "bank" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Bank Name</Label>
                        <select
                            value={method.bank_name ?? ""}
                            onChange={(e) => update({ bank_name: e.target.value })}
                            className="w-full h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                        >
                            <option value="">Select bank</option>
                            {KENYAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Branch</Label>
                        <input
                            placeholder="e.g. Westlands"
                            value={method.bank_branch ?? ""}
                            onChange={(e) => update({ bank_branch: e.target.value })}
                            className="w-full h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Account Number</Label>
                        <input
                            placeholder="Your account number"
                            value={method.bank_account ?? ""}
                            onChange={(e) => update({ bank_account: e.target.value })}
                            className="w-full h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Account Holder Name</Label>
                        <input
                            placeholder="Full name on account"
                            value={method.bank_account_name ?? ""}
                            onChange={(e) => update({ bank_account_name: e.target.value })}
                            className="w-full h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                        />
                    </div>
                </div>
            )}

            {method.type === "paypal" && (
                <div className="space-y-1.5">
                    <Label>PayPal Email Address</Label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={method.paypal_email ?? ""}
                        onChange={(e) => update({ paypal_email: e.target.value })}
                        className="w-full h-10 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                    />
                </div>
            )}
        </div>
    );
}

export function Step3Verification() {
    const { campaignDraft, updateDraft } = useCampaign();
    const [showMethodPicker, setShowMethodPicker] = useState(false);

    const getSupportingDocLabel = () => {
        switch (campaignDraft.category) {
            case "medical": return "Medical Report or Hospital Invoice";
            case "school_fees": return "School Fee Statement or Invoice";
            case "emergency": return "Proof of Emergency / Situational Evidence";
            case "community": return "Project Proposal or Community Approval Letter";
            default: return "Supporting Document";
        }
    };

    const addPaymentMethod = (type: PaymentMethodType) => {
        const already = campaignDraft.paymentMethods.find(m => m.type === type);
        if (already) return;
        updateDraft({ paymentMethods: [...campaignDraft.paymentMethods, { type }] });
        setShowMethodPicker(false);
    };

    const updatePaymentMethod = (index: number, updated: PaymentMethod) => {
        const methods = [...campaignDraft.paymentMethods];
        methods[index] = updated;
        updateDraft({ paymentMethods: methods });
    };

    const removePaymentMethod = (index: number) => {
        updateDraft({ paymentMethods: campaignDraft.paymentMethods.filter((_, i) => i !== index) });
    };

    const addedTypes = campaignDraft.paymentMethods.map(m => m.type);
    const availableOptions = PAYMENT_OPTIONS.filter(o => !addedTypes.includes(o.type));

    return (
        <div className="space-y-10 animate-slide-up max-w-3xl mx-auto">
            {/* Header */}
            <div className="space-y-3 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    <ShieldCheck className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Verification & Payment</h2>
                <p className="text-[var(--text-secondary)]">
                    We verify all campaigns to protect donors. Your information is encrypted and never shared publicly.
                </p>
            </div>

            {/* ─── SECTION 1: Identity ─── */}
            <div className="space-y-6 p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]">
                <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    Identity Verification
                </h3>

                <div className="space-y-2">
                    <Label htmlFor="idNumber">National ID or Passport Number</Label>
                    <input
                        id="idNumber"
                        placeholder="e.g. 12345678 or A1234567"
                        value={campaignDraft.idNumber}
                        onChange={(e) => updateDraft({ idNumber: e.target.value })}
                        className="w-full h-11 rounded-md border border-[var(--border-light)] bg-[var(--bg-primary)] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocUploadBox
                        label="ID / Passport — Front"
                        file={campaignDraft.idDocumentFront}
                        onUpload={(f) => updateDraft({ idDocumentFront: f })}
                        onRemove={() => updateDraft({ idDocumentFront: undefined })}
                    />
                    <DocUploadBox
                        label="ID / Passport — Back (if applicable)"
                        file={campaignDraft.idDocumentBack}
                        onUpload={(f) => updateDraft({ idDocumentBack: f })}
                        onRemove={() => updateDraft({ idDocumentBack: undefined })}
                    />
                </div>
            </div>

            {/* ─── SECTION 2: Supporting Document ─── */}
            <div className="space-y-6 p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]">
                <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    Supporting Documents
                </h3>
                <p className="text-sm text-[var(--text-secondary)] -mt-2">
                    Upload document(s) that prove your campaign's need. This is reviewed privately by our team.
                </p>

                <div className="space-y-3">
                    {(campaignDraft.supportingDocs ?? []).map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)]">
                            <FileText className="w-5 h-5 text-[var(--primary-green)] shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{doc.name}</p>
                                <p className="text-[10px] text-[var(--text-muted)]">{(doc.size / 1024).toFixed(0)} KB</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => updateDraft({ supportingDocs: campaignDraft.supportingDocs.filter((_, j) => j !== i) })}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-full"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    <label className="flex items-center gap-3 p-4 border-2 border-dashed border-[var(--border-light)] rounded-xl hover:border-[var(--primary-green)] hover:bg-[var(--primary-green)]/5 transition-all cursor-pointer group">
                        <Upload className="w-6 h-6 text-[var(--text-muted)] group-hover:text-[var(--primary-green)]" />
                        <div>
                            <p className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[var(--primary-green)]">
                                {getSupportingDocLabel()}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)]">PDF, JPG, PNG (max 10MB each)</p>
                        </div>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                updateDraft({ supportingDocs: [...(campaignDraft.supportingDocs ?? []), ...files] });
                            }}
                        />
                    </label>
                </div>
            </div>

            {/* ─── SECTION 3: Payment Withdrawal Methods ─── */}
            <div className="space-y-6 p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]">
                <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-green-600" />
                        How Should We Send You Funds?
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Add at least one withdrawal method. Funds are released after admin verification.
                    </p>
                </div>

                {/* Added methods */}
                {campaignDraft.paymentMethods.map((method, i) => (
                    <PaymentMethodForm
                        key={method.type}
                        method={method}
                        onChange={(updated) => updatePaymentMethod(i, updated)}
                        onRemove={() => removePaymentMethod(i)}
                    />
                ))}

                {/* Add method picker */}
                {availableOptions.length > 0 && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowMethodPicker(!showMethodPicker)}
                            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-[var(--border-light)] hover:border-[var(--primary-green)] hover:bg-[var(--primary-green)]/5 transition-all text-[var(--text-secondary)] hover:text-[var(--primary-green)]"
                        >
                            <span className="flex items-center gap-2 font-bold text-sm">
                                <Plus className="w-4 h-4" />
                                Add Payment Method
                            </span>
                            {showMethodPicker ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showMethodPicker && (
                            <div className="absolute z-10 top-full mt-2 left-0 right-0 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl shadow-xl overflow-hidden">
                                {availableOptions.map((opt) => (
                                    <button
                                        key={opt.type}
                                        type="button"
                                        onClick={() => addPaymentMethod(opt.type)}
                                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--bg-secondary)] transition-colors text-left border-b border-[var(--border-light)] last:border-b-0"
                                    >
                                        <opt.icon className={cn("w-5 h-5 shrink-0", opt.color)} />
                                        <div>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">{opt.label}</p>
                                            <p className="text-[10px] text-[var(--text-muted)]">{opt.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Privacy Notice */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 flex gap-3">
                <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    <b>Privacy & Security:</b> Your documents and payment details are encrypted using bank-level security.
                    They are reviewed only by our Trust & Safety team and are <b>never</b> shown publicly on your campaign page.
                </p>
            </div>
        </div>
    );
}

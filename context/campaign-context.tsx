"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import { useAuth } from "./auth-context";

// ─── Types ──────────────────────────────────────────────────

export type PaymentMethodType = "mpesa_personal" | "mpesa_paybill" | "mpesa_till" | "bank" | "paypal";

export interface PaymentMethod {
    type: PaymentMethodType;
    // Personal M-Pesa
    mpesa_number?: string;
    mpesa_name?: string;
    // Paybill
    paybill_number?: string;
    paybill_account?: string;
    // Till
    till_number?: string;
    till_name?: string;
    // Bank
    bank_name?: string;
    bank_account?: string;
    bank_branch?: string;
    bank_account_name?: string;
    // PayPal
    paypal_email?: string;
}

export interface CampaignDraft {
    // Step 1 — Basics
    title: string;
    category: string;
    targetAmount: number;
    endDate?: Date;
    noDeadline: boolean;
    beneficiaryName: string;
    relationship: string;
    county: string;
    town: string;

    // Step 2 — Story & Media
    story: string;
    images: File[];
    imagePreviewUrls: string[];
    videoUrl?: string;

    // Step 3 — Verification & Payment
    idNumber: string;
    idDocumentFront?: File;
    idDocumentBack?: File;
    supportingDocs: File[];
    paymentMethods: PaymentMethod[];
    primaryPaymentMethod: PaymentMethodType | "";

    // Step 4 — Agreements
    agreedToTerms: boolean;
    accurateInfo: boolean;
    understandFee: boolean;
}

interface CampaignContextType {
    currentStep: number;
    campaignDraft: CampaignDraft;
    updateDraft: (data: Partial<CampaignDraft>) => void;
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    submitCampaign: () => Promise<void>;
    isSubmitting: boolean;
    submittedSlug: string | null;
    validationError: string | null;
}

const initialDraft: CampaignDraft = {
    title: "",
    category: "",
    targetAmount: 0,
    noDeadline: false,
    beneficiaryName: "",
    relationship: "",
    county: "",
    town: "",
    story: "",
    images: [],
    imagePreviewUrls: [],
    idNumber: "",
    supportingDocs: [],
    paymentMethods: [],
    primaryPaymentMethod: "",
    agreedToTerms: false,
    accurateInfo: false,
    understandFee: false,
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: React.ReactNode }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [campaignDraft, setCampaignDraft] = useState<CampaignDraft>(initialDraft);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedSlug, setSubmittedSlug] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useAuth();

    const updateDraft = (data: Partial<CampaignDraft>) => {
        setCampaignDraft((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        setValidationError(null);
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };
    const prevStep = () => {
        setValidationError(null);
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };
    const setStep = (step: number) => setCurrentStep(step);

    const submitCampaign = async () => {
        if (!user) {
            setValidationError("You must be signed in to create a campaign.");
            return;
        }

        // Basic validation
        if (!campaignDraft.title.trim()) {
            setValidationError("Campaign title is required.");
            return;
        }
        if (!campaignDraft.category) {
            setValidationError("Please select a campaign category.");
            return;
        }
        if (campaignDraft.targetAmount < 1000) {
            setValidationError("Fundraising goal must be at least KES 1,000.");
            return;
        }
        if (!campaignDraft.story.trim() || campaignDraft.story.length < 100) {
            setValidationError("Please write at least 100 characters about your campaign story.");
            return;
        }
        if (!campaignDraft.agreedToTerms || !campaignDraft.accurateInfo || !campaignDraft.understandFee) {
            setValidationError("Please agree to all terms before submitting.");
            return;
        }

        setIsSubmitting(true);
        setValidationError(null);

        try {
            const supabase = createClient();

            // 1. Generate a unique slug
            const baseSlug = generateSlug(campaignDraft.title);
            const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

            // 2. Build primary payment info for the campaign row
            const pm = campaignDraft.paymentMethods[0];
            const paymentFields: Record<string, string | undefined> = {};
            if (pm) {
                switch (pm.type) {
                    case "mpesa_personal":
                        paymentFields.withdrawal_mpesa_number = pm.mpesa_number;
                        paymentFields.withdrawal_mpesa_name = pm.mpesa_name;
                        paymentFields.withdrawal_mpesa_type = "personal";
                        break;
                    case "mpesa_paybill":
                        paymentFields.withdrawal_paybill_number = pm.paybill_number;
                        paymentFields.withdrawal_paybill_account = pm.paybill_account;
                        paymentFields.withdrawal_mpesa_type = "paybill";
                        break;
                    case "mpesa_till":
                        paymentFields.withdrawal_till_number = pm.till_number;
                        paymentFields.withdrawal_mpesa_name = pm.till_name;
                        paymentFields.withdrawal_mpesa_type = "till";
                        break;
                    case "bank":
                        paymentFields.withdrawal_bank_name = pm.bank_name;
                        paymentFields.withdrawal_bank_account = pm.bank_account;
                        paymentFields.withdrawal_bank_branch = pm.bank_branch;
                        paymentFields.withdrawal_bank_account_name = pm.bank_account_name;
                        break;
                    case "paypal":
                        paymentFields.withdrawal_paypal_email = pm.paypal_email;
                        break;
                }
            }

            // 3. Insert campaign record
            const { data: campaign, error: campaignError } = await supabase
                .from("campaigns")
                .insert({
                    creator_id: user.id,
                    title: campaignDraft.title.trim(),
                    slug: uniqueSlug,
                    category: campaignDraft.category,
                    target_amount: campaignDraft.targetAmount,
                    current_amount: 0,
                    story: campaignDraft.story.trim(),
                    beneficiary_name: campaignDraft.beneficiaryName || null,
                    beneficiary_relationship: campaignDraft.relationship || null,
                    county: campaignDraft.county || null,
                    town: campaignDraft.town || null,
                    deadline: campaignDraft.noDeadline ? null : campaignDraft.endDate?.toISOString() ?? null,
                    no_deadline: campaignDraft.noDeadline,
                    status: "pending_review",
                    id_number: campaignDraft.idNumber || null,
                    ...paymentFields,
                })
                .select()
                .single();

            if (campaignError) throw new Error(campaignError.message);

            // 4. Upload campaign images
            if (campaignDraft.images.length > 0) {
                const imageUploads = campaignDraft.images.map(async (file, index) => {
                    const ext = file.name.split(".").pop();
                    const path = `${campaign.id}/${index}-${Date.now()}.${ext}`;
                    const { error: uploadError, data: uploadData } = await supabase.storage
                        .from("campaign-images")
                        .upload(path, file, { upsert: true });

                    if (uploadError) {
                        console.error("Image upload error:", uploadError);
                        return;
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from("campaign-images")
                        .getPublicUrl(path);

                    await supabase.from("campaign_images").insert({
                        campaign_id: campaign.id,
                        storage_url: publicUrl,
                        order_index: index,
                    });
                });

                await Promise.all(imageUploads);
            }

            // 5. Upload supporting documents
            if (campaignDraft.supportingDocs.length > 0) {
                const docUploads = campaignDraft.supportingDocs.map(async (file) => {
                    const ext = file.name.split(".").pop();
                    const path = `${campaign.id}/docs/${Date.now()}-${file.name}`;
                    const { error: uploadError } = await supabase.storage
                        .from("campaign-documents")
                        .upload(path, file, { upsert: true });

                    if (uploadError) {
                        console.error("Doc upload error:", uploadError);
                        return;
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from("campaign-documents")
                        .getPublicUrl(path);

                    await supabase.from("campaign_documents").insert({
                        campaign_id: campaign.id,
                        storage_url: publicUrl,
                        file_name: file.name,
                        file_size: file.size,
                        doc_type: "proof_of_need",
                    });
                });

                await Promise.all(docUploads);
            }

            // 6. Upload ID documents
            if (campaignDraft.idDocumentFront) {
                const file = campaignDraft.idDocumentFront;
                const ext = file.name.split(".").pop();
                const path = `${campaign.id}/id/front-${Date.now()}.${ext}`;
                const { error } = await supabase.storage
                    .from("campaign-documents")
                    .upload(path, file, { upsert: true });

                if (!error) {
                    const { data: { publicUrl } } = supabase.storage
                        .from("campaign-documents")
                        .getPublicUrl(path);
                    await supabase.from("campaigns")
                        .update({ id_document_front: publicUrl })
                        .eq("id", campaign.id);
                }
            }

            setSubmittedSlug(uniqueSlug);
        } catch (err: any) {
            console.error("Campaign submission error:", err);
            setValidationError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <CampaignContext.Provider
            value={{
                currentStep,
                campaignDraft,
                updateDraft,
                nextStep,
                prevStep,
                setStep,
                submitCampaign,
                isSubmitting,
                submittedSlug,
                validationError,
            }}
        >
            {children}
        </CampaignContext.Provider>
    );
}

export function useCampaign() {
    const context = useContext(CampaignContext);
    if (context === undefined) {
        throw new Error("useCampaign must be used within a CampaignProvider");
    }
    return context;
}

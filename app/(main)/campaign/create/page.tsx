"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useCampaign, CampaignProvider } from "@/context/campaign-context";
import { Step1Basics } from "@/components/campaign/create/step-1";
import { Step2Story } from "@/components/campaign/create/step-2";
import { Step3Verification } from "@/components/campaign/create/step-3";
import { Step4Review } from "@/components/campaign/create/step-4";
import { SuccessView } from "@/components/campaign/create/success";
import { ChevronLeft, ChevronRight, Save, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Basics", "Your Story", "Verification", "Review & Submit"];

function CampaignCreateContent() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const {
        currentStep, nextStep, prevStep,
        isSubmitting, submittedSlug, validationError,
        submitCampaign
    } = useCampaign();
    const router = useRouter();
    const [lastSaved, setLastSaved] = useState<Date>(new Date());
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Protected Route — prompt unauthenticated users to sign-in
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            setShowAuthModal(true);
        }
    }, [isAuthenticated, authLoading]);

    // Auto-save indicator (cosmetic; actual save on submit)
    useEffect(() => {
        const interval = setInterval(() => setLastSaved(new Date()), 30000);
        return () => clearInterval(interval);
    }, []);

    // On success, show the success screen
    if (submittedSlug) {
        return <SuccessView />;
    }

    if (authLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-[var(--primary-green)] animate-spin" />
                <p className="text-[var(--text-secondary)] font-medium animate-pulse">Checking authentication...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <AuthModal isOpen={showAuthModal} onClose={() => router.push("/")} />
            </div>
        );
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1Basics />;
            case 2: return <Step2Story />;
            case 3: return <Step3Verification />;
            case 4: return <Step4Review />;
            default: return <Step1Basics />;
        }
    };

    const progress = (currentStep / 4) * 100;

    const handleNext = () => {
        nextStep();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePrev = () => {
        prevStep();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async () => {
        await submitCampaign();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-10 pb-32">
            <div className="container-custom max-w-5xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest">
                            <span className="text-[var(--primary-green)]">Step {currentStep} of 4</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                            <span>{STEP_LABELS[currentStep - 1]}</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Start your fundraiser</h1>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-secondary)] rounded-full border border-[var(--border-light)] text-xs text-[var(--text-secondary)]">
                        <Save className="w-3.5 h-3.5 text-[var(--primary-green)]" />
                        <span>Draft saved at {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-12 space-y-4">
                    <ProgressBar progress={progress} className="h-2 bg-[var(--bg-secondary)]" />
                    <div className="grid grid-cols-4 gap-2 md:gap-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-center">
                        {STEP_LABELS.map((label, i) => (
                            <span
                                key={label}
                                className={cn(
                                    "transition-colors",
                                    currentStep > i + 1 ? "text-[var(--primary-green)]" :
                                        currentStep === i + 1 ? "text-[var(--primary-green)]" :
                                            "text-[var(--text-muted)]"
                                )}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Validation Error Banner */}
                {validationError && (
                    <div className="mb-8 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{validationError}</p>
                    </div>
                )}

                {/* Current Step Content */}
                <div className="bg-[var(--bg-primary)]">
                    {renderStep()}
                </div>

                {/* Sticky Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-[var(--bg-primary)]/90 backdrop-blur-md border-t border-[var(--border-light)] z-40">
                    <div className="container-custom max-w-5xl flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrev}
                            disabled={currentStep === 1 || isSubmitting}
                            className="gap-2 h-12 px-6 font-bold"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </Button>

                        {/* Step dots indicator (desktop) */}
                        <div className="hidden md:flex gap-1.5 items-center">
                            {[1, 2, 3, 4].map((s) => (
                                <div
                                    key={s}
                                    className={cn(
                                        "rounded-full transition-all",
                                        currentStep === s
                                            ? "w-6 h-2 bg-[var(--primary-green)]"
                                            : currentStep > s
                                                ? "w-2 h-2 bg-[var(--primary-green)]/60"
                                                : "w-2 h-2 bg-[var(--border-light)]"
                                    )}
                                />
                            ))}
                        </div>

                        {currentStep < 4 ? (
                            <Button
                                variant="primary"
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="gap-2 h-12 px-8 font-bold shadow-lg shadow-[var(--primary-green)]/20"
                            >
                                Continue
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="gap-2 h-12 px-8 font-bold shadow-lg shadow-[var(--primary-green)]/20 min-w-[160px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Campaign
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CampaignCreatePage() {
    return (
        <CampaignProvider>
            <CampaignCreateContent />
        </CampaignProvider>
    );
}

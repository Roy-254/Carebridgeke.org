"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Smartphone,
    User as UserIcon,
    Loader2,
    ChevronLeft,
    Heart,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup" | "forgot_password" | "email_sent" | "signup_success";
type SignMethod = "email" | "google" | "phone";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "signin" | "signup";
}

function ErrorBanner({ message }: { message: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm"
        >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{message}</span>
        </motion.div>
    );
}

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [method, setMethod] = useState<SignMethod>("email");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successEmail, setSuccessEmail] = useState("");
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const supabase = createClient();

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setMethod("email");
            setIsLoading(false);
            setError(null);
            setPasswordStrength(0);
        }
    }, [isOpen, initialMode]);

    // Clear error when switching modes
    useEffect(() => {
        setError(null);
    }, [mode, method]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val.length === 0) setPasswordStrength(0);
        else if (val.length < 6) setPasswordStrength(1);
        else if (val.length < 10) setPasswordStrength(2);
        else setPasswordStrength(3);
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const result = await signIn(
                formData.get("email") as string,
                formData.get("password") as string
            );
            if (result?.error) {
                setError(result.error);
            } else {
                onClose();
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const email = formData.get("email") as string;
            const result = await signUp({
                email,
                password: formData.get("password") as string,
                fullName: formData.get("fullName") as string,
                phone: (formData.get("phone") as string) || undefined,
            });
            if (result?.error) {
                setError(result.error);
            } else if (result?.needsEmailConfirmation) {
                setSuccessEmail(email);
                setMode("signup_success");
            } else {
                // If it doesn't need email confirmation (i.e. session returned directly), close modal
                onClose();
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const email = formData.get("reset-email") as string;
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            });
            if (resetError) {
                setError(resetError.message);
            } else {
                setSuccessEmail(email);
                setMode("email_sent");
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 8 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 8 },
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            <motion.div
                className="relative w-full max-w-md bg-[var(--bg-primary)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-light)]"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)] z-10"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="p-8 pb-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--primary-green)]/10 rounded-full mb-4">
                        {(mode === "signup_success" || mode === "email_sent") ? (
                            <CheckCircle className="w-7 h-7 text-[var(--primary-green)]" />
                        ) : (
                            <Heart className="w-7 h-7 text-[var(--primary-green)]" fill="currentColor" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        {mode === "signin" ? "Welcome Back" :
                            mode === "signup" ? "Create Account" :
                                mode === "forgot_password" ? "Reset Password" :
                                    mode === "email_sent" ? "Check Your Email" :
                                        "Confirm Your Email"}
                    </h2>
                    <p className="text-[var(--text-secondary)] mt-1 text-sm">
                        {mode === "signin" ? "Sign in to your Unity Bridge account" :
                            mode === "signup" ? "Join thousands helping Kenyans thrive" :
                                mode === "forgot_password" ? "Enter your email to receive a password reset link" :
                                    mode === "email_sent" ? `We've sent a reset link to ${successEmail}` :
                                        `We've sent a confirmation link to ${successEmail}`}
                    </p>
                </div>

                <div className="px-8 pb-8">
                    <AnimatePresence mode="wait">

                        {/* ── SIGN IN ─────────────────────────────── */}
                        {mode === "signin" && (
                            <motion.div
                                key="signin"
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 16 }}
                                className="space-y-5"
                            >
                                {/* Method Tabs */}
                                <div className="flex p-1 bg-[var(--bg-secondary)] rounded-lg">
                                    {(["email", "google", "phone"] as SignMethod[]).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setMethod(m)}
                                            className={cn(
                                                "flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize",
                                                method === m
                                                    ? "bg-[var(--bg-primary)] text-[var(--primary-green)] shadow-sm"
                                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                            )}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>

                                {method === "email" && (
                                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                                        <AnimatePresence>
                                            {error && <ErrorBanner message={error} />}
                                        </AnimatePresence>
                                        <div className="space-y-2">
                                            <Label htmlFor="signin-email">Email Address</Label>
                                            <Input
                                                id="signin-email"
                                                name="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                required
                                                icon={<Mail className="w-4 h-4" />}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="signin-password">Password</Label>
                                                <button
                                                    type="button"
                                                    onClick={() => setMode("forgot_password")}
                                                    className="text-xs text-[var(--primary-green)] hover:underline"
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="signin-password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    required
                                                    icon={<Lock className="w-4 h-4" />}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <Button type="submit" variant="primary" className="w-full h-11" disabled={isLoading}>
                                            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Signing in...</> : "Sign In"}
                                        </Button>
                                    </form>
                                )}

                                {method === "google" && (
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {error && <ErrorBanner message={error} />}
                                        </AnimatePresence>
                                        <Button
                                            variant="outline"
                                            className="w-full h-11 bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
                                            onClick={async () => {
                                                setError(null);
                                                try {
                                                    await signInWithGoogle();
                                                } catch {
                                                    setError("Google sign-in failed. Please try again.");
                                                }
                                            }}
                                        >
                                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            Continue with Google
                                        </Button>
                                    </div>
                                )}

                                {method === "phone" && (
                                    <div className="space-y-4 text-center py-6">
                                        <Smartphone className="w-12 h-12 text-[var(--text-muted)] mx-auto" />
                                        <div>
                                            <p className="font-bold text-[var(--text-primary)]">Phone OTP — Coming Soon</p>
                                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                                                SMS sign-in is being set up. Please use email or Google for now.
                                            </p>
                                        </div>
                                        <Button variant="outline" className="w-full h-11" onClick={() => setMethod("email")}>
                                            Use Email Instead
                                        </Button>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-[var(--border-light)] text-center text-sm text-[var(--text-secondary)]">
                                    Don&apos;t have an account?{" "}
                                    <button onClick={() => setMode("signup")} className="text-[var(--primary-green)] font-bold hover:underline">
                                        Create Account
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ── SIGN UP ─────────────────────────────── */}
                        {mode === "signup" && (
                            <motion.div
                                key="signup"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                className="space-y-4"
                            >
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <AnimatePresence>
                                        {error && <ErrorBanner message={error} />}
                                    </AnimatePresence>
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input id="fullName" name="fullName" placeholder="Jane Doe" required icon={<UserIcon className="w-4 h-4" />} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email Address</Label>
                                        <Input id="signup-email" name="email" type="email" placeholder="name@example.com" required icon={<Mail className="w-4 h-4" />} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-phone">Phone Number <span className="text-[var(--text-muted)] text-xs">(optional)</span></Label>
                                        <Input id="signup-phone" name="phone" placeholder="+254712345678" icon={<Smartphone className="w-4 h-4" />} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="signup-password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                required
                                                minLength={8}
                                                onChange={handlePasswordChange}
                                                icon={<Lock className="w-4 h-4" />}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {/* Strength Meter */}
                                        <div className="flex gap-1 h-1 mt-1">
                                            {[...Array(3)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "flex-1 rounded-full transition-colors duration-300",
                                                        i < passwordStrength
                                                            ? passwordStrength === 1 ? "bg-red-500" : passwordStrength === 2 ? "bg-orange-500" : "bg-green-500"
                                                            : "bg-[var(--bg-secondary)]"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-[var(--text-muted)]">
                                            Minimum 8 characters
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-2 pt-1">
                                        <input type="checkbox" id="terms" className="mt-1 accent-[var(--primary-green)]" required />
                                        <label htmlFor="terms" className="text-xs text-[var(--text-secondary)]">
                                            I agree to the{" "}
                                            <button type="button" className="text-[var(--primary-green)] hover:underline">Terms & Conditions</button>
                                            {" "}and{" "}
                                            <button type="button" className="text-[var(--primary-green)] hover:underline">Privacy Policy</button>
                                        </label>
                                    </div>

                                    <Button type="submit" variant="primary" className="w-full h-11" disabled={isLoading}>
                                        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating account...</> : "Create Account"}
                                    </Button>
                                </form>

                                <div className="pt-4 border-t border-[var(--border-light)] text-center text-sm text-[var(--text-secondary)]">
                                    Already have an account?{" "}
                                    <button onClick={() => setMode("signin")} className="text-[var(--primary-green)] font-bold hover:underline">
                                        Sign In
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ── FORGOT PASSWORD ──────────────────────── */}
                        {mode === "forgot_password" && (
                            <motion.div
                                key="forgot"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                className="space-y-5"
                            >
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <AnimatePresence>
                                        {error && <ErrorBanner message={error} />}
                                    </AnimatePresence>
                                    <div className="space-y-2">
                                        <Label htmlFor="reset-email">Email Address</Label>
                                        <Input
                                            id="reset-email"
                                            name="reset-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            icon={<Mail className="w-4 h-4" />}
                                        />
                                    </div>
                                    <Button type="submit" variant="primary" className="w-full h-11" disabled={isLoading}>
                                        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</> : "Send Reset Link"}
                                    </Button>
                                </form>
                                <button
                                    onClick={() => setMode("signin")}
                                    className="flex items-center justify-center w-full text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Back to Sign In
                                </button>
                            </motion.div>
                        )}

                        {/* ── EMAIL SENT (password reset) ──────────── */}
                        {mode === "email_sent" && (
                            <motion.div
                                key="email_sent"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                className="space-y-5 text-center py-4"
                            >
                                <div className="w-16 h-16 bg-[var(--primary-green)]/10 rounded-full flex items-center justify-center mx-auto">
                                    <Mail className="w-8 h-8 text-[var(--primary-green)]" />
                                </div>
                                <div>
                                    <p className="text-[var(--text-primary)] font-semibold">{successEmail}</p>
                                    <p className="text-sm text-[var(--text-secondary)] mt-2">
                                        Click the link in the email to reset your password. It may take a moment to arrive — check your spam folder too.
                                    </p>
                                </div>
                                <Button variant="outline" className="w-full h-11" onClick={() => setMode("signin")}>
                                    Back to Sign In
                                </Button>
                            </motion.div>
                        )}

                        {/* ── SIGN-UP SUCCESS (email confirmation) ─── */}
                        {mode === "signup_success" && (
                            <motion.div
                                key="signup_success"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                className="space-y-5 text-center py-4"
                            >
                                <div className="w-16 h-16 bg-[var(--primary-green)]/10 rounded-full flex items-center justify-center mx-auto">
                                    <Mail className="w-8 h-8 text-[var(--primary-green)]" />
                                </div>
                                <div>
                                    <p className="text-[var(--text-primary)] font-semibold">{successEmail}</p>
                                    <p className="text-sm text-[var(--text-secondary)] mt-2">
                                        Your account is almost ready! Check your inbox for a <strong>confirmation email</strong> and click the link to activate your account, then sign in.
                                    </p>
                                </div>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Can&apos;t find it? Check your spam or junk folder.
                                </p>
                                <Button variant="outline" className="w-full h-11" onClick={() => setMode("signin")}>
                                    Go to Sign In
                                </Button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

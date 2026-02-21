"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    phone_number?: string;
    county?: string;
    is_verified: boolean;
    role: "user" | "admin";
}

interface AuthContextType {
    user: UserProfile | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{ error?: string }>;
    signUp: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<{ error?: string, needsEmailConfirmation?: boolean }>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const buildProfile = async (supabaseUser: SupabaseUser): Promise<UserProfile | null> => {
        try {
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", supabaseUser.id)
                .single();

            if (!profile) {
                // Profile created by DB trigger but might not exist in edge cases
                return {
                    id: supabaseUser.id,
                    email: supabaseUser.email ?? "",
                    full_name: supabaseUser.user_metadata?.full_name ?? supabaseUser.email?.split("@")[0] ?? "",
                    avatar_url: supabaseUser.user_metadata?.avatar_url,
                    is_verified: false,
                    role: "user",
                };
            }

            return {
                id: profile.id,
                email: supabaseUser.email ?? "",
                full_name: profile.full_name ?? "",
                avatar_url: profile.avatar_url,
                phone_number: profile.phone_number,
                county: profile.county,
                is_verified: profile.is_verified,
                role: profile.role as "user" | "admin",
            };
        } catch {
            return null;
        }
    };

    const refreshSession = useCallback(async () => {
        const { data: { session: newSession } } = await supabase.auth.getSession();
        setSession(newSession);
        if (newSession?.user) {
            const profile = await buildProfile(newSession.user);
            setUser(profile);
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
            setSession(initialSession);
            if (initialSession?.user) {
                const profile = await buildProfile(initialSession.user);
                setUser(profile);
            }
            setIsLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            setSession(newSession);
            if (newSession?.user) {
                const profile = await buildProfile(newSession.user);
                setUser(profile);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setIsLoading(false);
        if (error) return { error: error.message };
        return {};
    };

    const signUp = async ({ email, password, fullName, phone }: {
        email: string; password: string; fullName: string; phone?: string;
    }) => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName, phone_number: phone },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (!error && data.user) {
            // Also update the profile row with phone if provided
            if (phone) {
                await supabase.from("profiles").update({ phone_number: phone }).eq("id", data.user.id);
            }
        }
        setIsLoading(false);
        if (error) return { error: error.message };

        // Return information about whether a session was created immediately
        return { needsEmailConfirmation: !data.session };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return;
        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: updates.full_name,
                avatar_url: updates.avatar_url,
                phone_number: updates.phone_number,
                county: updates.county,
            })
            .eq("id", user.id);

        if (!error) {
            setUser((prev) => prev ? { ...prev, ...updates } : null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isAuthenticated: !!user,
                isLoading,
                signIn,
                signUp,
                signOut,
                signInWithGoogle,
                updateProfile,
                refreshSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Heart,
    User,
    LayoutDashboard,
    Briefcase,
    History,
    Settings,
    LogOut,
    ChevronDown,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export function Header() {
    const { user, isAuthenticated, signOut } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userInitials = user?.full_name
        ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
        : "U";

    return (
        <>
            <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-light)] shadow-sm">
                <nav className="container-custom py-3 sm:py-4">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--primary-green)] shrink-0" fill="currentColor" />
                            <div className="flex flex-col">
                                <h1 className="text-lg md:text-2xl font-bold text-[var(--text-primary)] leading-tight whitespace-nowrap">
                                    <span className="hidden sm:inline">Care Bridge Kenya</span>
                                    <span className="sm:hidden">Care Bridge</span>
                                </h1>
                                <p className="hidden sm:block text-xs text-[var(--text-secondary)] whitespace-nowrap">Building Bridges of Hope</p>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/explore" className="text-[var(--text-secondary)] hover:text-[var(--primary-green)] transition-colors font-medium">Explore</Link>
                            <Link href="/#how-it-works" className="text-[var(--text-secondary)] hover:text-[var(--primary-green)] transition-colors font-medium">How It Works</Link>
                            <Link href="/#about" className="text-[var(--text-secondary)] hover:text-[var(--primary-green)] transition-colors font-medium">About</Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <ThemeToggle />

                            {!isAuthenticated ? (
                                <Button variant="outline" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                                    Sign In
                                </Button>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-1 sm:gap-2 p-1 sm:pl-2 sm:pr-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors group"
                                    >
                                        <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)]">
                                            {user?.full_name.split(" ")[0]}
                                        </span>
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--primary-green)] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-sm">
                                            {userInitials}
                                        </div>
                                        <ChevronDown className={cn("hidden lg:block w-4 h-4 text-[var(--text-secondary)] transition-transform", isDropdownOpen && "rotate-180")} />
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                                            <div className="px-4 py-2 border-b border-[var(--border-light)] mb-1">
                                                <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user?.full_name}</p>
                                                <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
                                            </div>
                                            <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-green)] hover:bg-[var(--bg-secondary)] transition-colors">
                                                <User className="w-4 h-4" /> My Profile
                                            </Link>
                                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-green)] hover:bg-[var(--bg-secondary)] transition-colors">
                                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                                            </Link>
                                            <Link href="/dashboard/campaigns" className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-green)] hover:bg-[var(--bg-secondary)] transition-colors">
                                                <Briefcase className="w-4 h-4" /> My Campaigns
                                            </Link>
                                            <Link href="/dashboard/donations" className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-green)] hover:bg-[var(--bg-secondary)] transition-colors">
                                                <History className="w-4 h-4" /> Donation History
                                            </Link>
                                            <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-green)] hover:bg-[var(--bg-secondary)] transition-colors">
                                                <Settings className="w-4 h-4" /> Settings
                                            </Link>
                                            <div className="border-t border-[var(--border-light)] mt-1 pt-1">
                                                <button
                                                    onClick={() => {
                                                        signOut();
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" /> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mobile Menu Hamburger */}
                            <button className="md:hidden p-1 text-[var(--text-secondary)]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden pt-4 pb-2 border-t border-[var(--border-light)] mt-3 flex flex-col gap-2 animate-fade-in">
                            <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-primary)] font-medium p-3 hover:bg-[var(--bg-secondary)] rounded-md transition-colors">Explore Campaigns</Link>
                            <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-primary)] font-medium p-3 hover:bg-[var(--bg-secondary)] rounded-md transition-colors">How It Works</Link>
                            <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-primary)] font-medium p-3 hover:bg-[var(--bg-secondary)] rounded-md transition-colors">About Us</Link>
                        </div>
                    )}
                </nav>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            {/* Backdrop for closing dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </>
    );
}

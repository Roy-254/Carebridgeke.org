"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
    User,
    LayoutDashboard,
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
    const pathname = usePathname();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isHomePage = pathname === "/";

    const userInitials = user?.full_name
        ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
        : "U";

    // Header is only transparent on homepage top
    const isTransparent = isHomePage;

    return (
        <>
            <header
                className={cn(
                    "z-50 transition-all duration-300 w-full",
                    isTransparent
                        ? "absolute top-0 left-0 right-0 bg-transparent border-transparent py-4 sm:py-6"
                        : "relative bg-[var(--bg-primary)] border-b border-[var(--border-light)] shadow-sm py-3 sm:py-4"
                )}
            >
                <nav className="container-custom">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                                <Image
                                    src="/logo.jpeg"
                                    alt="Care Bridge Kenya Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className={cn(
                                    "text-lg md:text-2xl font-bold leading-tight whitespace-nowrap transition-colors",
                                    isTransparent ? "text-white" : "text-[var(--text-primary)]"
                                )}>
                                    <span className="hidden sm:inline">Care Bridge Kenya</span>
                                    <span className="sm:hidden">Care Bridge</span>
                                </h1>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/explore"
                                className={cn(
                                    "transition-colors font-medium",
                                    isTransparent ? "text-white/90 hover:text-white" : "text-[var(--text-secondary)] hover:text-[var(--primary-green)]"
                                )}
                            >Our Projects</Link>
                            <Link
                                href="/#how-it-works"
                                className={cn(
                                    "transition-colors font-medium",
                                    isTransparent ? "text-white/90 hover:text-white" : "text-[var(--text-secondary)] hover:text-[var(--primary-green)]"
                                )}
                            >How to Help</Link>
                            <Link
                                href="/#about"
                                className={cn(
                                    "transition-colors font-medium",
                                    isTransparent ? "text-white/90 hover:text-white" : "text-[var(--text-secondary)] hover:text-[var(--primary-green)]"
                                )}
                            >About Us</Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <ThemeToggle />

                            {!isAuthenticated ? (
                                <>
                                    <Button
                                        variant={isTransparent ? "outline" : "outline"}
                                        className={cn(isTransparent && "border-white/50 text-white hover:bg-white/10")}
                                        size="sm"
                                        onClick={() => setIsAuthModalOpen(true)}
                                    >
                                        Sign In
                                    </Button>
                                    <Link href="/explore" className="hidden sm:block">
                                        <Button variant="primary" size="sm">
                                            Donate Now
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={cn(
                                            "flex items-center gap-1 sm:gap-2 p-1 sm:pl-2 sm:pr-1 rounded-full transition-colors group",
                                            isTransparent ? "hover:bg-white/10" : "hover:bg-[var(--bg-secondary)]"
                                        )}
                                    >
                                        <span className={cn(
                                            "hidden sm:block text-sm font-medium transition-colors",
                                            isTransparent ? "text-white" : "text-[var(--text-primary)]"
                                        )}>
                                            {user?.full_name.split(" ")[0]}
                                        </span>
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--primary-green)] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-sm">
                                            {userInitials}
                                        </div>
                                        <ChevronDown className={cn(
                                            "hidden lg:block w-4 h-4 transition-all",
                                            isTransparent ? "text-white/70" : "text-[var(--text-secondary)]",
                                            isDropdownOpen && "rotate-180"
                                        )} />
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
                            <button
                                className={cn(
                                    "md:hidden p-1 transition-colors",
                                    isTransparent ? "text-white" : "text-[var(--text-secondary)]"
                                )}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {isMobileMenuOpen && (
                        <div className={cn(
                            "md:hidden pt-4 pb-6 border-t mt-3 flex flex-col gap-2 animate-fade-in px-4 rounded-b-2xl",
                            isTransparent
                                ? "bg-black/60 backdrop-blur-lg border-white/10"
                                : "bg-[var(--bg-primary)] border-[var(--border-light)]"
                        )}>
                            <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className={cn("font-medium p-3 rounded-md transition-colors", isTransparent ? "text-white hover:bg-white/10" : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]")}>Our Projects</Link>
                            <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className={cn("font-medium p-3 rounded-md transition-colors", isTransparent ? "text-white hover:bg-white/10" : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]")}>How to Help</Link>
                            <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className={cn("font-medium p-3 rounded-md transition-colors", isTransparent ? "text-white hover:bg-white/10" : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]")}>About Us</Link>
                            <div className={cn("pt-4 border-t", isTransparent ? "border-white/10" : "border-[var(--border-light)]")}>
                                <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full">Donate Now</Button>
                                </Link>
                            </div>
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

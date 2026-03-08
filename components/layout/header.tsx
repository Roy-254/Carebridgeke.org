"use client";

// ─────────────────────────────────────────────────────────────────
//  FEATURE FLAG — set false to revert to compact dropdown menus
// ─────────────────────────────────────────────────────────────────
const FULL_WIDTH_MEGA_MENU = true;

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
    ChevronDown, Menu, X, Heart,
    Users, Phone, BookOpen, Stethoscope,
    AlertCircle, Building2, HandHeart, UserPlus,
    Handshake, Share2, BarChart3, HelpCircle, Eye,
    Globe, TrendingUp,
    type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────
interface CompactNavItem { label: string; href: string; icon: LucideIcon; desc: string; external?: boolean; }
interface CompactMenu { label: string; cols: 1 | 2; items: CompactNavItem[]; }
interface MegaLink { label: string; href: string; external?: boolean; }
interface MegaColumn { heading: string; links: MegaLink[]; }
interface MegaFeatured {
    heading: string; body: string;
    cta: { label: string; href: string };
    icon: LucideIcon; image: string;
    stats?: { value: string; label: string }[];
}
interface MegaMenu { label: string; featured: MegaFeatured; columns: MegaColumn[]; }

// ═══════════════════════════════════════════════════════════════════
//  COMPACT nav data (FULL_WIDTH_MEGA_MENU = false)
// ═══════════════════════════════════════════════════════════════════
const COMPACT_NAV: CompactMenu[] = [
    {
        label: "About Us", cols: 1,
        items: [
            { label: "Who We Are", href: "/about", icon: Users, desc: "Our story and values" },
            { label: "Mission & Vision", href: "/about#mission", icon: Heart, desc: "What drives us forward" },
            { label: "Accountability", href: "/accountability", icon: BarChart3, desc: "How we use funds" },
            { label: "Contact Us", href: "/contact", icon: Phone, desc: "Get in touch" },
        ],
    },
    {
        label: "Get Involved", cols: 2,
        items: [
            { label: "Make a Donation", href: "/explore", icon: HandHeart, desc: "Support a project today" },
            { label: "Volunteer With Us", href: "/get-involved#volunteer", icon: UserPlus, desc: "Lend your time & skills" },
            { label: "Partner With Us", href: "/get-involved#partner", icon: Handshake, desc: "Corporate & NGO partnerships" },
            { label: "Spread the Word", href: "/get-involved#share", icon: Share2, desc: "Help us reach more people" },
        ],
    },
    {
        label: "Impact", cols: 1,
        items: [
            { label: "Our Work", href: "/our-work", icon: BarChart3, desc: "Active initiatives & stories" },
            { label: "How We Help", href: "/how-it-works", icon: HelpCircle, desc: "Our process & approach" },
            { label: "Impact Report 2026", href: "/reports/2026", icon: Globe, desc: "Our 2026 report" },
        ],
    },
];

// ═══════════════════════════════════════════════════════════════════
//  MEGA nav data (FULL_WIDTH_MEGA_MENU = true)
// ═══════════════════════════════════════════════════════════════════
const MEGA_NAV: MegaMenu[] = [
    {
        label: "About Us",
        featured: {
            icon: TrendingUp,
            // Using the Our Projects image — community/giving scene
            image: "/site-images/community-leaders.png",
            heading: "Lifting burdens, building futures",
            body: "Care Bridge Kenya bridges the gap between donors and verified charitable initiatives — from school fees to emergency relief.",
            cta: { label: "Our Full Story", href: "/about" },
        },
        columns: [
            {
                heading: "Who We Are",
                links: [
                    { label: "Our Story", href: "/about#story" },
                    { label: "Mission & Vision", href: "/about#mission" },
                    { label: "Our Values", href: "/about#values" },
                    { label: "Our Team", href: "/about#team" },
                ],
            },
            {
                heading: "Accountability",
                links: [
                    { label: "How We Use Funds", href: "/accountability#funds" },
                    { label: "Project Verification", href: "/accountability#verification" },
                ],
            },
            {
                heading: "Connect",
                links: [
                    { label: "Contact Us", href: "/contact" },
                    { label: "FAQs", href: "/contact#faq" },
                ],
            },
        ],
    },
    {
        label: "Get Involved",
        featured: {
            icon: HandHeart,
            image: "/site-images/volunteer-impact.png",
            heading: "Join us in making a difference",
            body: "Whether you donate, volunteer, or share — every action helps a Kenyan family overcome hardship. No act is too small.",
            cta: { label: "Donate Now", href: "/donate" },
            stats: [
                { value: "KES 950K+", label: "Total Raised" },
                { value: "200+", label: "Supporters" },
                { value: "3", label: "Focus Areas" },
            ],
        },
        columns: [
            {
                heading: "Give",
                links: [
                    { label: "Make a Donation", href: "/explore" },
                    { label: "Corporate Giving", href: "/get-involved#partner" },
                ],
            },
            {
                heading: "Act",
                links: [
                    { label: "Volunteer With Us", href: "/get-involved#volunteer" },
                    { label: "Become a Partner", href: "/get-involved#partner" },
                    { label: "Host a Fundraiser", href: "/get-involved#fundraise" },
                ],
            },
            {
                heading: "Share",
                links: [
                    { label: "Spread the Word", href: "/get-involved#share" },
                    { label: "Share on WhatsApp", href: "https://wa.me/?text=Support+Care+Bridge+Kenya+%F0%9F%87%B0%F0%9F%87%AA+https://carebridgekenya.com", external: true },
                    { label: "Share on Facebook", href: "https://facebook.com/sharer/sharer.php?u=https://carebridgekenya.com", external: true },
                ],
            },
        ],
    },
    {
        label: "Impact",
        featured: {
            icon: Globe,
            image: "/site-images/children-joy.png",
            heading: "Real change, real people",
            body: "Track how donations are used and follow the progress of every project we fund. Transparency is at the heart of what we do.",
            cta: { label: "See Our Work", href: "/our-work" },
            stats: [
                { value: "KES 950K+", label: "Raised to date" },
                { value: "3", label: "Active projects" },
                { value: "2026", label: "Year founded" },
            ],
        },
        columns: [
            {
                heading: "Our Work",
                links: [
                    { label: "Current Projects", href: "/explore" },
                    { label: "Project Updates", href: "/our-work#updates" },
                    { label: "How It Works", href: "/how-it-works" },
                ],
            },
            {
                heading: "Reports",
                links: [
                    { label: "Impact Report 2026", href: "/reports/2026" },
                    { label: "Transparency Dashboard", href: "/transparency" },
                    { label: "Track Your Donation", href: "/track" },
                ],
            },
        ],
    },
];

// ═══════════════════════════════════════════════════════════════════
//  COMPACT dropdown panel
// ═══════════════════════════════════════════════════════════════════
function CompactPanel({ menu, onClose, stayOpen, onLeave }: {
    menu: CompactMenu; onClose: () => void; stayOpen: () => void; onLeave: () => void;
}) {
    return (
        <div
            className="absolute top-full left-1/2 mt-2 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-light)] shadow-2xl overflow-hidden z-50 p-2"
            style={{ animation: "dropdownEnter 0.2s ease-out forwards", transformOrigin: "top center", minWidth: menu.cols === 2 ? "480px" : "260px" }}
            onMouseEnter={stayOpen}
            onMouseLeave={onLeave}
        >
            <div className="h-0.5 bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-blue)] rounded-full mb-3 mx-2" />
            <div className={cn("grid gap-1", menu.cols === 2 ? "grid-cols-2" : "grid-cols-1")}>
                {menu.items.map(sub => {
                    const Icon = sub.icon;
                    return (
                        <Link key={sub.href + sub.label} href={sub.href} onClick={onClose}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors group">
                            <div className="w-8 h-8 rounded-lg bg-[var(--primary-green)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--primary-green)]/20 transition-colors mt-0.5">
                                <Icon className="w-4 h-4 text-[var(--primary-green)]" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-green)] transition-colors leading-tight">{sub.label}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">{sub.desc}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
//  FULL-WIDTH mega panel  —  NO bottom bar
// ═══════════════════════════════════════════════════════════════════
function MegaPanel({ menu, onClose }: { menu: MegaMenu; onClose: () => void }) {
    const colCount = menu.columns.length;

    return (
        <div
            className="absolute top-full left-0 w-full bg-[var(--bg-primary)] border-b border-[var(--border-light)] shadow-2xl z-50"
            style={{ animation: "megaMenuEnter 0.22s ease-out forwards" }}
        >
            {/* Accent line */}
            <div className="h-0.5 bg-gradient-to-r from-[var(--primary-green)] via-[var(--primary-blue)] to-[var(--primary-green)]" />

            <div className="container-custom py-7">
                <div
                    className="grid gap-0 divide-x divide-[var(--border-light)]"
                    style={{ gridTemplateColumns: `280px repeat(${colCount}, 1fr)` }}
                >
                    {/* ── Featured panel with image ── */}
                    <div className="pr-7">
                        <div className="relative rounded-xl overflow-hidden" style={{ minHeight: "260px", height: "100%" }}>
                            <Image
                                src={menu.featured.image}
                                alt={menu.featured.heading}
                                fill
                                className="object-cover"
                                sizes="280px"
                                unoptimized
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            {/* Content — heading + CTA only */}
                            <div className="absolute inset-x-0 bottom-0 p-5">
                                <h3 className="text-base font-extrabold text-white leading-snug mb-3">{menu.featured.heading}</h3>
                                <Link href={menu.featured.cta.href} onClick={onClose} className="block">
                                    <span className="flex items-center justify-center w-full py-2 text-xs font-bold bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90 text-white rounded-lg transition-colors">
                                        {menu.featured.cta.label} →
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── Link columns ── */}
                    {menu.columns.map((col, i) => (
                        <div key={col.heading} className={cn("flex flex-col gap-1", i === 0 ? "px-7" : "px-7")}>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)] mb-2 pb-2 border-b border-[var(--border-light)]">
                                {col.heading}
                            </h4>
                            {col.links.map(link =>
                                link.external ? (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-green)] hover:translate-x-1 transition-all duration-150 py-1 font-medium flex items-center gap-1"
                                    >
                                        {link.label}
                                        <span className="text-[10px] opacity-50">↗</span>
                                    </a>
                                ) : (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={onClose}
                                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-green)] hover:translate-x-1 transition-all duration-150 py-1 font-medium"
                                    >
                                        {link.label}
                                    </Link>
                                )
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
//  HEADER
// ═══════════════════════════════════════════════════════════════════
export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 16);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 1280) setMobileOpen(false); };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const openDropdown = (label: string) => { if (leaveTimer.current) clearTimeout(leaveTimer.current); setActiveDropdown(label); };
    const closeDropdown = () => { leaveTimer.current = setTimeout(() => setActiveDropdown(null), 120); };
    const stayOpen = () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); };

    const toggleMobileSection = (label: string) =>
        setMobileExpanded(prev => prev === label ? null : label);

    // Build mobile link list from whichever data set is active
    const mobileItems = FULL_WIDTH_MEGA_MENU
        ? MEGA_NAV.map(m => ({ label: m.label, icon: m.featured.icon, links: m.columns.flatMap(c => c.links.map(l => ({ ...l, icon: m.featured.icon }))) }))
        : COMPACT_NAV.map(m => ({ label: m.label, icon: m.items[0]?.icon, links: m.items.map(i => ({ label: i.label, href: i.href, icon: i.icon, external: i.external })) }));

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300 relative",
                isScrolled || mobileOpen
                    ? "bg-[var(--bg-primary)] border-b border-[var(--border-light)] shadow-lg"
                    : "bg-[var(--bg-primary)] border-b border-[var(--border-light)]"
            )}
            onMouseLeave={closeDropdown}
        >
            <nav className="container-custom">
                {/* ── Main bar ── */}
                <div className="flex items-center justify-between h-16 xl:h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0" onClick={() => setActiveDropdown(null)}>
                        <div className="relative w-9 h-9 xl:w-11 xl:h-11 shrink-0">
                            <Image src="/logo.jpeg" alt="Care Bridge Kenya" fill className="object-contain" priority />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-base xl:text-lg font-bold text-[var(--text-primary)] whitespace-nowrap hidden sm:block">Care Bridge Kenya</span>
                            <span className="text-base font-bold text-[var(--text-primary)] sm:hidden">Care Bridge</span>
                            <span className="text-[10px] font-semibold text-[var(--primary-green)] uppercase tracking-widest hidden sm:block">Building Bridges of Hope</span>
                        </div>
                    </Link>

                    {/* Desktop nav triggers */}
                    <div className="hidden xl:flex items-center gap-0.5">
                        {FULL_WIDTH_MEGA_MENU
                            ? MEGA_NAV.map(item => (
                                <button
                                    key={item.label}
                                    onMouseEnter={() => openDropdown(item.label)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150",
                                        activeDropdown === item.label
                                            ? "text-[var(--primary-green)] bg-[var(--primary-green)]/8"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                                    )}
                                >
                                    {item.label}
                                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeDropdown === item.label && "rotate-180")} />
                                </button>
                            ))
                            : COMPACT_NAV.map(item => (
                                <div key={item.label} className="relative" onMouseEnter={() => openDropdown(item.label)} onMouseLeave={closeDropdown}>
                                    <button className={cn(
                                        "flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150",
                                        activeDropdown === item.label
                                            ? "text-[var(--primary-green)] bg-[var(--primary-green)]/8"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                                    )}>
                                        {item.label}
                                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeDropdown === item.label && "rotate-180")} />
                                    </button>
                                    {activeDropdown === item.label && (
                                        <CompactPanel menu={item} onClose={() => setActiveDropdown(null)} stayOpen={stayOpen} onLeave={closeDropdown} />
                                    )}
                                </div>
                            ))
                        }
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ThemeToggle />
                        <Link href="/donate" className="hidden sm:block" onClick={() => setActiveDropdown(null)}>
                            <Button variant="primary" size="sm" className="font-bold shadow-md shadow-green-900/20 px-5">
                                Donate Now
                            </Button>
                        </Link>
                        <button
                            className="xl:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
                            onClick={() => setMobileOpen(prev => !prev)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile menu ── */}
                {mobileOpen && (
                    <div className="xl:hidden border-t border-[var(--border-light)] py-3 animate-fade-in">
                        <div className="space-y-0.5">
                            {mobileItems.map(item => {
                                const isOpen = mobileExpanded === item.label;
                                const Icon = item.icon;
                                return (
                                    <div key={item.label}>
                                        <button
                                            onClick={() => toggleMobileSection(item.label)}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                                        >
                                            {item.label}
                                            <ChevronDown className={cn("w-4 h-4 text-[var(--text-muted)] transition-transform duration-200", isOpen && "rotate-180")} />
                                        </button>
                                        {isOpen && (
                                            <div className="ml-4 mb-2 space-y-0.5 animate-fade-in">
                                                {item.links.map(link =>
                                                    link.external ? (
                                                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                                                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--primary-green)] hover:bg-[var(--bg-secondary)] transition-colors">
                                                            <Icon className="w-4 h-4 shrink-0" />
                                                            {link.label} <span className="text-[10px] opacity-50">↗</span>
                                                        </a>
                                                    ) : (
                                                        <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--primary-green)] hover:bg-[var(--bg-secondary)] transition-colors">
                                                            <Icon className="w-4 h-4 shrink-0" />
                                                            {link.label}
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-2 pt-3 mt-3 border-t border-[var(--border-light)]">
                            <Link href="/donate" onClick={() => setMobileOpen(false)}>
                                <Button variant="primary" className="w-full font-bold">
                                    <Heart className="w-4 h-4" fill="currentColor" /> Donate Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Full-width mega panels (outside container, inside header) ── */}
            {activeDropdown && !mobileOpen && FULL_WIDTH_MEGA_MENU && (() => {
                const menu = MEGA_NAV.find(m => m.label === activeDropdown);
                return menu ? <MegaPanel key={activeDropdown} menu={menu} onClose={() => setActiveDropdown(null)} /> : null;
            })()}
        </header>
    );
}

"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    MapPin,
    LayoutGrid,
    List,
    ChevronDown,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/campaign/campaign-card";
import { KENYAN_COUNTIES, CATEGORY_LABELS } from "@/lib/constants";

export default function ExploreProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Mock data — to be replaced by Supabase call
    const projects: any[] = [
        {
            id: "1",
            title: "Help Sarah Complete Her Medical Degree",
            category: "school_fees",
            slug: "sarah-medical-degree",
            images: ["/sarah.png"],
            current_amount: 350000,
            target_amount: 500000,
            county: "Nairobi",
            is_urgent: true,
            view_count: 45
        },
        {
            id: "2",
            title: "Support Kibera Community Water Project",
            category: "community",
            slug: "kibera-water",
            images: ["https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800"],
            current_amount: 150000,
            target_amount: 800000,
            county: "Nairobi",
            is_urgent: false,
            view_count: 120
        },
        {
            id: "3",
            title: "Urgent Surgery for Baby Amara",
            category: "medical",
            slug: "baby-amara-surgery",
            images: ["https://images.unsplash.com/photo-1581595221471-ef07ecad79c4?w=800"],
            current_amount: 890000,
            target_amount: 1200000,
            county: "Mombasa",
            is_urgent: true,
            view_count: 89
        }
    ];

    return (
        <>
            {/* Header / Intro */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 to-[var(--bg-primary)] py-12 border-b border-[var(--border-light)]">
                <div className="container-custom">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
                            Our <span className="text-[var(--primary-green)]">Projects</span>
                        </h1>
                        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
                            Discover and support verified charitable projects across Kenya. Every donation, no matter the size, changes a life.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="container-custom py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden flex items-center gap-2 mb-4">
                        <Button
                            variant="outline"
                            className="flex-1 justify-between"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filters
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>

                    {/* Sidebar Filters */}
                    <aside className={`w-full lg:w-64 space-y-8 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>

                        {/* Search */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Search</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    className="input pl-10 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Focus Area</h3>
                            <div className="flex flex-col gap-1">
                                <button
                                    className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${!selectedCategory ? 'bg-[var(--primary-green)]/10 text-[var(--primary-green)] font-bold' : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    All Areas
                                </button>
                                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === key ? 'bg-[var(--primary-green)]/10 text-[var(--primary-green)] font-bold' : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}
                                        onClick={() => setSelectedCategory(key)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Counties */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Location</h3>
                                {selectedCounty && (
                                    <button onClick={() => setSelectedCounty(null)} className="text-[10px] text-[var(--primary-red)] font-bold">CLEAR</button>
                                )}
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <select
                                    className="input pl-10 text-sm appearance-none cursor-pointer"
                                    value={selectedCounty || ""}
                                    onChange={(e) => setSelectedCounty(e.target.value || null)}
                                >
                                    <option value="">All 47 Counties</option>
                                    {KENYAN_COUNTIES.map(county => (
                                        <option key={county} value={county}>{county}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                        </div>

                        {/* Active Filters Display (Mobile) */}
                        <div className="lg:hidden flex flex-wrap gap-2 pt-4">
                            {selectedCategory && (
                                <span className="badge badge-info flex items-center gap-1">
                                    {CATEGORY_LABELS[selectedCategory as keyof typeof CATEGORY_LABELS]}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
                                </span>
                            )}
                            {selectedCounty && (
                                <span className="badge badge-success flex items-center gap-1">
                                    {selectedCounty}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCounty(null)} />
                                </span>
                            )}
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-sm text-[var(--text-secondary)]">
                                Showing <span className="font-bold text-[var(--text-primary)]">{projects.length}</span> active projects
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="p-2 h-9 w-9 bg-[var(--bg-secondary)] border border-[var(--border-light)]">
                                    <LayoutGrid className="w-4 h-4 text-[var(--primary-green)]" />
                                </Button>
                                <Button variant="ghost" size="sm" className="p-2 h-9 w-9">
                                    <List className="w-4 h-4 text-[var(--text-muted)]" />
                                </Button>
                                <div className="h-6 w-0.5 bg-[var(--border-light)] mx-1" />
                                <select className="bg-transparent text-sm font-bold text-[var(--text-secondary)] outline-none cursor-pointer hover:text-[var(--primary-green)] transition-colors">
                                    <option>Most Recent</option>
                                    <option>Nearly Funded</option>
                                    <option>Most Urgent</option>
                                    <option>Goal Amount</option>
                                </select>
                            </div>
                        </div>

                        {/* Project Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <CampaignCard key={project.id} campaign={project} />
                            ))}

                            {projects.length === 0 && (
                                <div className="col-span-full py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto">
                                        <Search className="w-8 h-8 text-[var(--text-muted)]" />
                                    </div>
                                    <h3 className="text-xl font-bold">No projects found</h3>
                                    <p className="text-[var(--text-secondary)] max-w-xs mx-auto">
                                        Try adjusting your filters to find what you&apos;re looking for.
                                    </p>
                                    <Button variant="outline" onClick={() => {
                                        setSelectedCategory(null);
                                        setSelectedCounty(null);
                                        setSearchQuery("");
                                    }}>
                                        Clear All Filters
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {projects.length > 0 && (
                            <div className="mt-12 flex justify-center border-t border-[var(--border-light)] pt-10">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled>Previous</Button>
                                    <div className="flex items-center gap-1">
                                        <Button variant="primary" size="sm" className="h-9 w-9 p-0">1</Button>
                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">2</Button>
                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">3</Button>
                                        <span className="px-2 text-[var(--text-muted)] inline-block">...</span>
                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">10</Button>
                                    </div>
                                    <Button variant="outline" size="sm">Next</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

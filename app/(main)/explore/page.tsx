"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    LayoutGrid,
    List,
    ChevronDown,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/campaign/campaign-card";
import { CATEGORY_LABELS } from "@/lib/constants";

export default function ExploreProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Mock data — to be replaced by Supabase call
    const projects: any[] = [
        {
            id: "1",
            title: "Making sure every kid studies",
            description: "Providing tuition support and learning materials to help underprivileged students stay in school and unlock their potential.",
            category: "school_fees",
            slug: "every-kid-studies",
            images: ["/school-fees-project.png"],
            current_amount: 350000,
            target_amount: 500000,
            is_urgent: false,
            view_count: 45
        },
        {
            id: "2",
            title: "Impacting lives of the less privileged",
            description: "Community-led initiatives providing essential resources and sustainable support for vulnerable families across Kenya.",
            category: "community",
            slug: "impacting-lives",
            images: ["https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800"],
            current_amount: 420000,
            target_amount: 600000,
            is_urgent: false,
            view_count: 120
        },
        {
            id: "3",
            title: "Clearing hospital bills",
            description: "Supporting families burdened by medical debt, ensuring quality healthcare is accessible without financial ruin.",
            category: "medical",
            slug: "clearing-hospital-bills",
            images: ["/medical-relief-project.png"],
            current_amount: 180000,
            target_amount: 500000,
            is_urgent: false,
            view_count: 89
        },
        {
            id: "4",
            title: "Restoring Our Environment",
            description: "Cleaning up Kenya — collecting litter from informal dumpsites, unclogging roadside drainage channels, and revitalising public parks, markets, schools, and community buildings.",
            category: "community",
            slug: "restoring-our-environment",
            images: ["/environment-project.png"],
            current_amount: 0,
            target_amount: 800000,
            is_urgent: false,
            view_count: 0
        }
    ];

    // Filter projects based on search and category
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || project.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                                {Object.entries(CATEGORY_LABELS).filter(([key]) => key !== 'other').map(([key, label]) => (
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



                        {/* Active Filters Display (Mobile) */}
                        <div className="lg:hidden flex flex-wrap gap-2 pt-4">
                            {selectedCategory && (
                                <span className="badge badge-info flex items-center gap-1">
                                    {CATEGORY_LABELS[selectedCategory as keyof typeof CATEGORY_LABELS]}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
                                </span>
                            )}
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-sm text-[var(--text-secondary)]">
                                Showing <span className="font-bold text-[var(--text-primary)]">{filteredProjects.length}</span> active projects
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
                                    <option>Goal Amount</option>
                                </select>
                            </div>
                        </div>

                        {/* Project Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <CampaignCard key={project.id} campaign={project} />
                            ))}

                            {filteredProjects.length === 0 && (
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
                                        setSearchQuery("");
                                    }}>
                                        Clear All Filters
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {filteredProjects.length > 0 && (
                            <div className="mt-12 flex justify-center border-t border-[var(--border-light)] pt-10">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled>Previous</Button>
                                    <div className="flex items-center gap-1">
                                        <Button variant="primary" size="sm" className="h-9 w-9 p-0">1</Button>
                                    </div>
                                    <Button variant="outline" size="sm" disabled>Next</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORY_LABELS } from "@/lib/constants";

interface FeaturedProject {
    id: string;
    slug: string;
    title: string;
    category: string;
    description?: string;
    images?: { storage_url: string; order_index: number }[];
}

const CATEGORY_COLORS: Record<string, string> = {
    school_fees: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    medical: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    emergency: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    community: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    other: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300",
};

function getCoverImage(images?: { storage_url: string; order_index: number }[]): string {
    if (!images || images.length === 0) return "/placeholder-campaign.jpg";
    return [...images].sort((a, b) => a.order_index - b.order_index)[0].storage_url;
}

export function FeaturedHorizontal({ projects }: { projects: FeaturedProject[] }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // We calculate horizontal scroll based on how many items we have
    // This allows the right-most tile to be fully exposed before the user finishes scrolling
    // Precision scroll: Stops exactly when the 4th tile is fully exposed on the right.
    const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(projects.length - 2) * 20}%`]);

    return (
        <section ref={targetRef} className="relative h-[250vh] bg-[var(--bg-primary)]">
            {/* Header: Left-aligned text, right-aligned button, scrolls away naturally */}
            <div className="container-custom pt-32 pb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--border-light)] pb-12 mb-8">
                    <div className="max-w-2xl text-left">
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--primary-green)] mb-3 block">OUR IMPACT</span>
                        <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-4 tracking-tighter leading-none">Featured Projects</h2>
                        <p className="text-[var(--text-secondary)] text-base md:text-xl opacity-80 leading-relaxed max-w-lg">
                            Verified projects needing your support right now.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Link href="/explore">
                            <Button variant="outline" size="lg" className="rounded-full px-10 hover:bg-[var(--primary-green)] hover:text-white transition-all font-bold border-[var(--border-light)] text-[var(--text-primary)] h-14 text-lg group">
                                View All Projects
                                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">


                <div className="relative">
                    {/* Shadow indicators */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

                    <motion.div style={{ x }} className="flex gap-8 pl-[10vw]">
                        {projects.map((project) => {
                            const coverImage = getCoverImage(project.images);
                            const categoryColor = CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS.other;
                            const categoryLabel = CATEGORY_LABELS[project.category as keyof typeof CATEGORY_LABELS] ?? project.category;

                            return (
                                <motion.div 
                                    key={project.id} 
                                    className="w-[300px] md:w-[420px] shrink-0"
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="overflow-hidden group min-h-[460px] flex flex-col border-[var(--border-light)] bg-[var(--bg-secondary)] shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl items-stretch">
                                        <div className="relative h-[220px] overflow-hidden shrink-0">
                                            <Image
                                                src={coverImage}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                                unoptimized={coverImage.startsWith("https://images.unsplash.com") || coverImage.startsWith("/")}
                                            />
                                            <div className="absolute top-5 left-5">
                                                <span className={`px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest backdrop-blur-md shadow-lg border border-white/10 ${categoryColor}`}>
                                                    {categoryLabel}
                                                </span>
                                            </div>
                                        </div>

                                        <CardContent className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg md:text-xl font-black text-[var(--text-primary)] line-clamp-1 leading-tight mb-3 group-hover:text-[var(--primary-green)] transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-base text-[var(--text-secondary)] line-clamp-3 leading-relaxed opacity-80">
                                                    {project.description}
                                                </p>
                                            </div>

                                            <div className="pt-6 border-t border-[var(--border-light)]/40 overflow-hidden">
                                                <Link href={`/campaign/${project.slug}`} className="w-full">
                                                    <Button className="w-full h-12 rounded-xl bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90 text-white font-bold text-base group/btn shadow-lg shadow-green-900/10">
                                                        Support Now
                                                        <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                        
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

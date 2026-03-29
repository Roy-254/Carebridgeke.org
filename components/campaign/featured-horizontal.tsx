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
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
                <div className="container-custom py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-light)] pb-8 mb-10">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary-green)] mb-2 block">Our Impact</span>
                            <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">Featured Projects</h2>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-sm md:text-right opacity-80">
                                Verified projects needing your support right now.
                            </p>
                            <Link href="/explore">
                                <Button variant="outline" size="sm" className="rounded-full px-6 hover:bg-[var(--primary-green)] hover:text-white transition-all font-bold">
                                    View All Projects
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

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
                                    className="w-[280px] md:w-[350px] shrink-0"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="overflow-hidden group h-[400px] flex flex-col border-[var(--border-light)] bg-[var(--bg-secondary)] shadow-sm hover:shadow-lg transition-all duration-500 rounded-xl">
                                        <div className="relative h-48 overflow-hidden shrink-0">
                                            <Image
                                                src={coverImage}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                                unoptimized={coverImage.startsWith("https://images.unsplash.com") || coverImage.startsWith("/")}
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest backdrop-blur-md shadow-lg border border-white/10 ${categoryColor}`}>
                                                    {categoryLabel}
                                                </span>
                                            </div>
                                        </div>

                                        <CardContent className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-1 leading-tight mb-2 group-hover:text-[var(--primary-green)] transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed opacity-75">
                                                    {project.description}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-[var(--border-light)]/40">
                                                <Link href={`/campaign/${project.slug}`} className="w-full">
                                                    <Button className="w-full h-10 rounded-lg bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90 text-white font-bold text-xs group/btn">
                                                        Support Now
                                                        <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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

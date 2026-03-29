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
    const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(projects.length - 1.5) * 20}%`]);

    return (
        <section ref={targetRef} className="relative h-[250vh] bg-[var(--bg-primary)]">
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
                <div className="container-custom mb-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-green)] mb-3 block">Make an Impact</span>
                            <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">Featured Projects</h2>
                            <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-xl">
                                Verified projects needing your support right now. Scroll to explore our latest initiatives.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <Link href="/explore">
                                <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-[var(--primary-green)] hover:text-white transition-all">
                                    View All Projects
                                    <ArrowRight className="w-5 h-5 ml-2" />
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
                                    className="w-[380px] md:w-[500px] shrink-0"
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="overflow-hidden group h-[520px] flex flex-col border-[var(--border-light)] bg-[var(--bg-secondary)] shadow-sm hover:shadow-2xl transition-shadow duration-500 rounded-3xl">
                                        <div className="relative h-64 overflow-hidden shrink-0">
                                            <Image
                                                src={coverImage}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                                unoptimized={coverImage.startsWith("https://images.unsplash.com") || coverImage.startsWith("/")}
                                            />
                                            <div className="absolute top-6 left-6">
                                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest backdrop-blur-md shadow-xl border border-white/20 ${categoryColor}`}>
                                                    {categoryLabel}
                                                </span>
                                            </div>
                                        </div>

                                        <CardContent className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-2xl font-black text-[var(--text-primary)] line-clamp-2 leading-[1.1] mb-4 group-hover:text-[var(--primary-green)] transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-base text-[var(--text-secondary)] line-clamp-3 leading-relaxed opacity-80">
                                                    {project.description}
                                                </p>
                                            </div>

                                            <div className="pt-8 border-t border-[var(--border-light)]/40 flex items-center justify-between">
                                                <Link href={`/campaign/${project.slug}`} className="w-full">
                                                    <Button className="w-full h-14 rounded-2xl bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90 text-white font-bold text-lg group/btn shadow-lg shadow-green-900/20">
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
                        
                        {/* Final spacer/CTA card to reveal at the end */}
                        <div className="w-[300px] md:w-[400px] shrink-0 pr-[10vw] flex items-center justify-center">
                            <Link href="/explore" className="group">
                                <div className="p-10 rounded-3xl bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-light)] hover:border-[var(--primary-green)] transition-all text-center">
                                    <div className="w-20 h-20 bg-[var(--primary-green)]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                        <ArrowRight className="w-10 h-10 text-[var(--primary-green)]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Explore More</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">View all ongoing projects in Kenya</p>
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="container-custom mt-16 flex items-center gap-4">
                    <div className="h-1 flex-1 bg-[var(--border-light)] rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-[var(--primary-green)] origin-left"
                            style={{ scaleX: scrollYProgress }}
                        />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Scroll to Explore</span>
                </div>
            </div>
        </section>
    );
}

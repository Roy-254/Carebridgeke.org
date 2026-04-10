import Link from "next/link";
import Image from "next/image";
import { BookOpen, Heart, ArrowRight, Clock, Eye, Stethoscope, GraduationCap, Building2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Our Work | Unity Bridge Kenya",
    description: "Explore the active projects Unity Bridge Kenya is currently funding, read project updates, and follow the stories of the people we are supporting.",
};

const FOCUS_AREAS = [
    { icon: GraduationCap, label: "School Fees", href: "/explore?category=school_fees", color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" },
    { icon: Stethoscope, label: "Medical Relief", href: "/explore?category=medical", color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
    { icon: AlertCircle, label: "Emergency", href: "/explore?category=emergency", color: "text-red-500 bg-red-50 dark:bg-red-900/20" },
    { icon: Building2, label: "Community", href: "/explore?category=community", color: "text-green-500 bg-green-50 dark:bg-green-900/20" },
];

export default function OurWorkPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">

            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-16 md:py-24 border-b border-[var(--border-light)]">
                <div className="container-custom text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-sm font-semibold mb-6">
                        <Eye className="w-4 h-4" /> Our Work
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                        What We Are Doing Right Now
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                        Every project on this page has been reviewed by our team. We fund what we can verify — and we report back honestly on what happens next.
                    </p>
                </div>
            </section>

            {/* ── Focus areas ── */}
            <section className="py-10 border-b border-[var(--border-light)]">
                <div className="container-custom max-w-4xl">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/explore"
                            className="px-5 py-2.5 rounded-full border-2 border-[var(--primary-green)] bg-[var(--primary-green)]/5 text-[var(--primary-green)] text-sm font-bold transition-colors hover:bg-[var(--primary-green)] hover:text-white">
                            All Projects
                        </Link>
                        {FOCUS_AREAS.map(({ icon: Icon, label, href, color }) => (
                            <Link key={label} href={href}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[var(--border-light)] text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--primary-green)] hover:text-[var(--primary-green)] transition-colors">
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Current projects callout ── */}
            <section className="py-16 md:py-20">
                <div className="container-custom max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Active Now</span>
                            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2 mb-5 leading-snug">
                                Four Projects Running in 2026
                            </h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed mb-5">
                                We launched in 2026 with four carefully selected projects: a school fees support initiative, a medical relief fund, a community development project, and an environmental restoration drive. These are our proof of concept — we wanted to demonstrate the model before scaling it.
                            </p>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Each project has a dedicated page where you can see the story behind the need, the target amount, funds raised so far, and updates from both our team and the beneficiaries.
                            </p>
                            <div className="mt-8">
                                <Link href="/explore">
                                    <Button variant="primary" className="gap-2 font-bold">
                                        <Heart className="w-4 h-4" fill="currentColor" /> Browse All Projects
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                            <Image
                                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80"
                                alt="Community work in Kenya"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-5 left-5 flex gap-4">
                                <div className="text-white">
                                    <div className="text-2xl font-extrabold font-mono">4</div>
                                    <div className="text-xs text-white/70 uppercase tracking-wide">Active projects</div>
                                </div>
                                <div className="text-white">
                                    <div className="text-2xl font-extrabold font-mono">2026</div>
                                    <div className="text-xs text-white/70 uppercase tracking-wide">Year launched</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured project previews */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            {
                                slug: "education-fund",
                                title: "Kenya Education Fund",
                                category: "School Fees",
                                img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
                                raised: "KES 0",
                                goal: "KES 0",
                            },
                            {
                                slug: "medical-assistance",
                                title: "Hospital Bills Assistance",
                                category: "Medical Relief",
                                img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
                                raised: "KES 0",
                                goal: "KES 0",
                            },
                            {
                                slug: "community-support",
                                title: "Vulnerable Communities Support",
                                category: "Community",
                                img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=600&fit=crop",
                                raised: "KES 0",
                                goal: "KES 0",
                            },
                            {
                                slug: "environmental-cleaning",
                                title: "Environmental Cleaning Initiative",
                                category: "Community",
                                img: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?w=800",
                                raised: "KES 0",
                                goal: "KES 0",
                            },
                        ].map(project => (
                            <Link key={project.slug} href={`/donate?project=${project.slug}`}
                                className="group bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl overflow-hidden hover:border-[var(--primary-green)]/40 transition-all">
                                <div className="relative aspect-video">
                                    <Image src={project.img} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                                </div>
                                <div className="p-5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">{project.category}</span>
                                    <h3 className="font-bold text-[var(--text-primary)] mt-1 mb-3 leading-snug line-clamp-2 group-hover:text-[var(--primary-green)] transition-colors">{project.title}</h3>
                                    <div className="flex justify-between text-xs text-[var(--text-muted)] font-mono">
                                        <span>{project.raised} raised</span>
                                        <span>of {project.goal}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Updates ── */}
            <section id="updates" className="py-16 md:py-20 bg-[var(--bg-secondary)] border-y border-[var(--border-light)] scroll-mt-24">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Updates</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">Project Updates</h2>
                    </div>

                    {/* Honest empty state for a starting org */}
                    <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-light)] p-10 text-center">
                        <div className="w-14 h-14 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Clock className="w-7 h-7 text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Updates Coming Soon</h3>
                        <p className="text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                            We launched in 2026 and our first projects are actively fundraising. As funds are disbursed and outcomes become clear, we will post detailed updates here — with photos, progress notes, and honest reflections on what worked and what did not.
                        </p>
                        <div className="mt-6">
                            <Link href="/explore">
                                <Button variant="outline" className="font-semibold gap-2">
                                    View Active Projects <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How it works link ── */}
            <section className="py-16">
                <div className="container-custom max-w-4xl">
                    <div className="rounded-2xl bg-gradient-to-br from-[var(--primary-green)]/10 to-[var(--primary-blue)]/5 border border-[var(--primary-green)]/20 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Curious how we select and fund projects?</h3>
                            <p className="text-[var(--text-secondary)]">Read our full process — from application to disbursement.</p>
                        </div>
                        <Link href="/how-it-works" className="shrink-0">
                            <Button variant="primary" className="gap-2 font-bold whitespace-nowrap">
                                How It Works <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

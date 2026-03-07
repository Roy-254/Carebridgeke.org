import Link from "next/link";
import Image from "next/image";
import { BarChart3, FileText, Heart, Clock, ArrowRight, Download, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Impact Report 2026 | Care Bridge Kenya",
    description: "Care Bridge Kenya's 2026 impact report — our first year in operation. An honest account of what we set out to do, what we achieved, and what we are still building.",
};

const STATS_2026 = [
    { value: "3", label: "Projects launched", icon: TrendingUp },
    { value: "KES 950K+", label: "Raised from donors", icon: BarChart3 },
    { value: "200+", label: "Individual supporters", icon: Heart },
    { value: "2026", label: "Year of founding", icon: Clock },
];

export default function Report2026Page() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">

            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-16 md:py-24 border-b border-[var(--border-light)]">
                <div className="container-custom max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-sm font-semibold mb-6">
                        <BarChart3 className="w-4 h-4" /> Annual Impact Report
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                        Impact Report 2026
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                        Our first year in operation. An honest account of everything we have done, what we have learned, and where we are going next.
                    </p>
                </div>
            </section>

            {/* ── Honest note about being a new org ── */}
            <section className="py-12 border-b border-[var(--border-light)]">
                <div className="container-custom max-w-4xl">
                    <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-amber-800 dark:text-amber-200 mb-1">A note about this report</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                                Care Bridge Kenya was founded in 2026. This is our first year of operation and therefore our first impact report. We do not yet have audited financial statements, a formal regulatory filing, or multi-year data to compare against. What we have is honesty — this report reflects everything we have done and how we have done it, without embellishment. We will publish a more comprehensive report at the end of each year.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="py-16 md:py-20">
                <div className="container-custom max-w-5xl">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">2026 at a Glance</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">The Numbers So Far</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {STATS_2026.map(({ value, label, icon: Icon }) => (
                            <div key={label} className="bg-[var(--bg-secondary)] rounded-2xl p-6 text-center border border-[var(--border-light)]">
                                <div className="w-10 h-10 rounded-xl bg-[var(--primary-green)]/10 flex items-center justify-center mx-auto mb-3">
                                    <Icon className="w-5 h-5 text-[var(--primary-green)]" />
                                </div>
                                <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono mb-1">{value}</div>
                                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-semibold">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── What we did ── */}
            <section className="py-16 md:py-20 bg-[var(--bg-secondary)] border-y border-[var(--border-light)]">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">What We Did</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">Our First Year of Operations</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-light)] p-7">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">We launched three verified projects</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                                In 2026, we identified and verified three charitable needs: school fees support for underprivileged students, medical bill relief for families facing crippling healthcare costs, and a community development initiative serving marginalised households. Each project underwent manual review before being published on our platform.
                            </p>
                            <Link href="/explore" className="text-[var(--primary-green)] text-sm font-bold hover:underline flex items-center gap-1">
                                Browse active projects <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-light)] p-7">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">We built our platform from scratch</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                The Care Bridge Kenya website, payment system, and donor management infrastructure were all built in 2026. We integrated with Flutterwave for M-Pesa and card payments, and implemented end-to-end donor receipts. This is our foundation for scale.
                            </p>
                        </div>

                        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-light)] p-7">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">We are entirely volunteer-driven</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Every person working on Care Bridge Kenya in 2026 is a volunteer. Our operating costs are covered by the 5% platform fee on donations. No external funding has been raised for operations — all donor money goes to projects.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Where funds go ── */}
            <section className="py-16 md:py-20">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Fund Allocation</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">Where Every Shilling Goes</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-4 h-4 rounded-full bg-[var(--primary-green)]" />
                                <h3 className="font-bold text-[var(--text-primary)]">95% — Direct to Projects</h3>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                Goes directly to the beneficiary, institution (school, hospital), or verified supplier. No middlemen.
                            </p>
                        </div>
                        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-4 h-4 rounded-full bg-[var(--primary-blue)]" />
                                <h3 className="font-bold text-[var(--text-primary)]">5% — Platform Operations</h3>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                Covers payment processing fees, website hosting, email services, and administrative expenses. In 2026, no individual has been paid from this fund.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 p-5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl text-center">
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            <strong className="text-[var(--text-primary)]">Full financial statements</strong> are not yet available for 2026 as we are in the process of formal organisation registration. We are committed to publishing audited accounts once registration is complete. See our <Link href="/accountability" className="text-[var(--primary-green)] hover:underline font-semibold">Accountability page</Link> for more detail.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Looking ahead ── */}
            <section className="py-16 md:py-20 bg-[var(--bg-secondary)] border-y border-[var(--border-light)]">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Looking Ahead</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">What Comes Next</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                        {[
                            { emoji: "🏛️", title: "Formal Registration", body: "We are pursuing NGO registration in Kenya to formalise our legal status and enable tax-exempt giving." },
                            { emoji: "📊", title: "Audited Accounts", body: "Once registered, we will engage an independent auditor to verify our financial records annually." },
                            { emoji: "🏥", title: "More Projects", body: "We plan to expand to more projects in 2027, with deeper focus on medical and education sectors." },
                            { emoji: "🤝", title: "Institutional Partnerships", body: "We are building relationships with hospitals, schools, and county governments to identify genuine needs faster." },
                        ].map(({ emoji, title, body }) => (
                            <div key={title} className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-light)] p-6">
                                <span className="text-3xl block mb-3">{emoji}</span>
                                <h3 className="font-bold text-[var(--text-primary)] mb-2">{title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-12">
                <div className="container-custom max-w-2xl text-center">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">Be part of the 2027 story</h2>
                    <p className="text-[var(--text-secondary)] mb-6">The next chapter is being written right now. Every donation helps shape what this organisation becomes.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/explore"><Button variant="primary" className="gap-2 font-bold"><Heart className="w-4 h-4" fill="currentColor" /> Donate Today</Button></Link>
                        <Link href="/accountability"><Button variant="outline" className="font-semibold">Our Accountability</Button></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

import Link from "next/link";
import Image from "next/image";
import { Search, CheckCircle2, CreditCard, RefreshCw, Bell, ArrowRight, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "How It Works | Unity Bridge Kenya",
    description: "Learn how Unity Bridge Kenya selects projects, verifies them, receives donations, and disburses funds to beneficiaries across Kenya.",
};

const STEPS = [
    {
        num: "01",
        icon: Search,
        title: "A Need is Identified",
        body: "A family, individual, or community representative submits a request for support. We also proactively identify needs through our own outreach — visiting communities, speaking with social workers, and working with trusted referrers.",
        color: "from-green-500 to-emerald-600",
    },
    {
        num: "02",
        icon: ShieldCheck,
        title: "We Verify the Need",
        body: "Every application is reviewed manually. We collect and verify supporting documents (school fee statements, hospital bills, treatment plans, ID documents). Only needs we can independently verify are approved. We reject cases that cannot be substantiated.",
        color: "from-blue-500 to-cyan-600",
    },
    {
        num: "03",
        icon: Heart,
        title: "The Project Goes Live",
        body: "A campaign page is created with the story, the target amount, and the timeline. We write this page ourselves to ensure accuracy and dignity. The project is then open for donations via M-Pesa or card.",
        color: "from-purple-500 to-violet-600",
    },
    {
        num: "04",
        icon: CreditCard,
        title: "Donations Are Collected",
        body: "Donors give any amount they choose. Funds are collected through Flutterwave and held securely in a project-specific account. Every donor receives an instant email receipt with a transaction reference.",
        color: "from-orange-500 to-amber-600",
    },
    {
        num: "05",
        icon: RefreshCw,
        title: "Funds Are Disbursed",
        body: "Once sufficient funds are raised, we arrange direct payment to the school, hospital, or supplier — not to the individual where possible. This protects donors and ensures the money is used for its intended purpose.",
        color: "from-teal-500 to-green-600",
    },
    {
        num: "06",
        icon: Bell,
        title: "We Report Back",
        body: "After disbursement, we follow up with the beneficiary and post an update on the project page. Donors can see what their money achieved. We are honest about what went well and what did not.",
        color: "from-rose-500 to-pink-600",
    },
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">

            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-16 md:py-24 border-b border-[var(--border-light)]">
                <div className="container-custom text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-sm font-semibold mb-6">
                        <ShieldCheck className="w-4 h-4" /> How It Works
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                        From a Genuine Need to a Changed Life
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                        Unity Bridge Kenya is not a marketplace where anyone can post a campaign. We do the work of finding, verifying, and managing every project — so you can give with complete confidence.
                    </p>
                </div>
            </section>

            {/* ── The model explained ── */}
            <section className="py-12 border-b border-[var(--border-light)]">
                <div className="container-custom max-w-4xl">
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        {[
                            { emoji: "🔍", title: "We Find the Need", body: "Applications come to us. We do not put the work on vulnerable people to market themselves." },
                            { emoji: "✅", title: "We Verify It", body: "Every project is manually checked with documentation before it goes anywhere near a donor." },
                            { emoji: "📊", title: "We Report Back", body: "After funds are disbursed, we tell you exactly what happened." },
                        ].map(({ emoji, title, body }) => (
                            <div key={title} className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
                                <span className="text-4xl block mb-3">{emoji}</span>
                                <h3 className="font-bold text-[var(--text-primary)] mb-2">{title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Step by step ── */}
            <section id="process" className="py-16 md:py-20 scroll-mt-24">
                <div className="container-custom max-w-5xl">
                    <div className="text-center mb-14">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">The Process</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">Step by Step</h2>
                    </div>
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-[var(--border-light)] hidden md:block" />
                        <div className="space-y-8">
                            {STEPS.map(({ num, icon: Icon, title, body, color }, i) => (
                                <div key={num} className="relative flex gap-6 md:gap-10">
                                    {/* Step number badge */}
                                    <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold text-[var(--text-muted)] font-mono">STEP {num}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h3>
                                        <p className="text-[var(--text-secondary)] leading-relaxed">{body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Verification detail ── */}
            <section id="verification" className="py-16 md:py-20 bg-[var(--bg-secondary)] border-y border-[var(--border-light)] scroll-mt-24">
                <div className="container-custom max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Verification Detail</span>
                            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2 mb-5">What We Check Before Approving a Project</h2>
                            <ul className="space-y-3">
                                {[
                                    "Valid government-issued ID for the applicant",
                                    "Supporting document confirming the need (school fee statement, hospital bill, clinical notes, etc.)",
                                    "Proof of relationship between applicant and beneficiary (where applicable)",
                                    "A believable narrative that is consistent with the documents",
                                    "No red flags indicating misrepresentation or fraud",
                                ].map(item => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                                        <CheckCircle2 className="w-4 h-4 text-[var(--primary-green)] shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link href="/accountability">
                                    <Button variant="outline" className="font-semibold gap-2">
                                        Full Accountability Details <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                            <Image
                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
                                alt="Reviewing project documents"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-5 left-5 bg-[var(--primary-green)] text-white px-4 py-2 rounded-xl">
                                <p className="text-xs font-bold">Manual review</p>
                                <p className="text-[10px] text-white/80">Every single application</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Disbursement ── */}
            <section id="disbursement" className="py-16 md:py-20 scroll-mt-24">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Fund Disbursement</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">How Funds Reach Beneficiaries</h2>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-8 space-y-5">
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            Where possible, we make payments directly to institutions — the school, the hospital, the supplier — rather than disbursing cash to individuals. This ensures funds are used for their stated purpose.
                        </p>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            In cases where direct institutional payment is not possible (for example, a rural beneficiary purchasing materials with no formal supplier), we disburse via M-Pesa and require photographic confirmation of how the funds were spent.
                        </p>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            We retain the right to pause or halt disbursement if we discover information that changes our assessment of a project. Donors are notified whenever this occurs.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-12 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]">
                <div className="container-custom max-w-2xl text-center">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">Ready to give with confidence?</h2>
                    <p className="text-[var(--text-secondary)] mb-6">Browse verified projects and support a cause that matters.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/explore"><Button variant="primary" className="gap-2 font-bold"><Heart className="w-4 h-4" fill="currentColor" /> Browse Projects</Button></Link>
                        <Link href="/accountability"><Button variant="outline" className="font-semibold">Our Accountability</Button></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

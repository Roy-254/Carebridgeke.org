import Link from "next/link";
import { ShieldCheck, Search, FileText, CheckCircle2, Clock, ArrowRight, Heart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Accountability | Unity Bridge Kenya",
    description: "How Unity Bridge Kenya uses donor funds, verifies projects, and maintains full transparency in all its operations.",
};

const FUND_STEPS = [
    {
        step: "01",
        title: "Donation Received",
        body: "Every donation is recorded in our system the moment it is made. You receive an instant email receipt with a transaction reference.",
        icon: Heart,
    },
    {
        step: "02",
        title: "Funds Held Securely",
        body: "Donations are held in a dedicated account for the specific project you supported. Funds are never pooled with operating costs.",
        icon: ShieldCheck,
    },
    {
        step: "03",
        title: "Disbursement to Beneficiary",
        body: "Once verified, funds are transferred directly to the beneficiary or institution (school, hospital, supplier) — not to individual cash accounts where possible.",
        icon: CheckCircle2,
    },
    {
        step: "04",
        title: "Progress Reported",
        body: "We follow up with beneficiaries and post updates on the project page so donors can see the real-world outcome of their giving.",
        icon: FileText,
    },
];

const VERIFICATION_ITEMS = [
    {
        title: "Document Review",
        body: "Every applicant submits supporting documents — a school fee statement, medical report, or community project proposal. Our team reviews each one before approval.",
        icon: Search,
    },
    {
        title: "ID Verification",
        body: "Campaign applicants submit a valid government-issued ID (National ID or Passport). This ensures we can hold individuals accountable for the projects they represent.",
        icon: ShieldCheck,
    },
    {
        title: "Manual Approval",
        body: "No campaign goes live automatically. Every application is manually reviewed by our team. We reject campaigns that cannot be verified or that conflict with our values.",
        icon: CheckCircle2,
    },
    {
        title: "Ongoing Monitoring",
        body: "After a campaign goes live, we continue to check in with project leads. If a situation changes, we update donors and, if necessary, pause fund disbursement.",
        icon: Clock,
    },
];

export default function AccountabilityPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">

            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-16 md:py-24 border-b border-[var(--border-light)]">
                <div className="container-custom text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-sm font-semibold mb-6">
                        <ShieldCheck className="w-4 h-4" /> Accountability
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                        How We Handle Your Money
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                        Transparency is not a feature — it is the foundation. Here is exactly what happens from the moment you donate to when a life is changed.
                    </p>
                </div>
            </section>

            {/* ── How We Use Funds ── */}
            <section id="funds" className="py-16 md:py-20 scroll-mt-24">
                <div className="container-custom max-w-6xl">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Fund Flow</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">From Your Phone to Their Lives</h2>
                        <p className="text-[var(--text-secondary)] mt-3 max-w-xl mx-auto">
                            Every shilling is tracked. Here is the journey your donation takes.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FUND_STEPS.map(({ step, title, body, icon: Icon }) => (
                            <div key={step} className="relative bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
                                <div className="text-4xl font-extrabold text-[var(--primary-green)]/15 font-mono absolute top-4 right-5 leading-none select-none">{step}</div>
                                <div className="w-11 h-11 rounded-xl bg-[var(--primary-green)]/10 flex items-center justify-center mb-4">
                                    <Icon className="w-5 h-5 text-[var(--primary-green)]" />
                                </div>
                                <h3 className="font-bold text-[var(--text-primary)] mb-2">{title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>

                    {/* Platform fee note */}
                    <div className="mt-10 p-5 bg-[var(--primary-green)]/5 border border-[var(--primary-green)]/20 rounded-2xl flex items-start gap-4 max-w-3xl mx-auto">
                        <AlertCircle className="w-5 h-5 text-[var(--primary-green)] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-[var(--text-primary)] text-sm mb-1">Platform Fee — 5%</p>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                Unity Bridge Kenya retains a small 5% platform fee from each donation to cover payment processing, staff, operations, and ongoing development. The remaining <strong>95%</strong> goes directly to the project. We are committed to publishing a full breakdown of how operating funds are used as we grow.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Project Verification ── */}
            <section id="verification" className="py-16 md:py-20 bg-[var(--bg-secondary)] border-y border-[var(--border-light)] scroll-mt-24">
                <div className="container-custom max-w-6xl">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Verification Process</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">How We Vet Every Project</h2>
                        <p className="text-[var(--text-secondary)] mt-3 max-w-xl mx-auto">
                            We do not accept every application. We verify each one so you can give with confidence.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {VERIFICATION_ITEMS.map(({ title, body, icon: Icon }) => (
                            <div key={title} className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-light)] flex gap-5">
                                <div className="w-11 h-11 rounded-xl bg-[var(--primary-green)]/10 flex items-center justify-center shrink-0">
                                    <Icon className="w-5 h-5 text-[var(--primary-green)]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)] mb-2">{title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Our Commitments / Starting org honest note ── */}
            <section className="py-16 md:py-20">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Our Commitments</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">What We Promise You</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            "We will never misrepresent how funds are used.",
                            "We will update project pages when circumstances change, including when a campaign is paused or cancelled.",
                            "We will publish an annual impact report every year, starting with our 2026 report.",
                            "We will not share your personal information with third parties outside of payment processing.",
                            "We welcome questions — our contact details are always public and we respond to every query.",
                        ].map(c => (
                            <div key={c} className="flex items-start gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)]">
                                <CheckCircle2 className="w-5 h-5 text-[var(--primary-green)] shrink-0 mt-0.5" />
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{c}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
                        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                            <strong>A note from us (2026):</strong> Unity Bridge Kenya is a young organisation. We do not yet have audited financial statements or formal partnerships with regulatory bodies. We are building this transparency infrastructure step by step. If that level of maturity matters to you, we completely understand — and we invite you to check back as we grow. In the meantime, you can always contact us directly with any questions.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-12 border-t border-[var(--border-light)]">
                <div className="container-custom max-w-2xl text-center">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">Still have questions?</h2>
                    <p className="text-[var(--text-secondary)] mb-6">We are always happy to explain how we work in more detail.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/contact"><Button variant="primary" className="gap-2 font-bold">Contact Us <ArrowRight className="w-4 h-4" /></Button></Link>
                        <Link href="/explore"><Button variant="outline" className="gap-2 font-semibold">Browse Projects</Button></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

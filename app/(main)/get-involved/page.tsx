import Link from "next/link";
import Image from "next/image";
import {
    HandHeart, UserPlus, Handshake, Share2, Heart,
    ArrowRight, CheckCircle2, Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Get Involved | Unity Bridge Kenya",
    description: "Donate, volunteer, partner with us, or help spread the word. Every action you take brings Unity Bridge Kenya closer to helping more Kenyans.",
};

export default function GetInvolvedPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">

            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-16 md:py-24 border-b border-[var(--border-light)]">
                <div className="container-custom text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-sm font-semibold mb-6">
                        <HandHeart className="w-4 h-4" /> Get Involved
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                        Every Action Counts
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                        You do not need to write a large cheque to make a difference. Donate, volunteer, partner with us, or simply share our work — every contribution changes a life.
                    </p>
                </div>
            </section>

            {/* ── Give ── */}
            <section id="give" className="py-16 md:py-20 scroll-mt-24">
                <div className="container-custom max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Give</span>
                            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2 mb-5 leading-snug">
                                Make a Direct Donation
                            </h2>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p>
                                    The most direct way to help is to donate to one of our verified projects. Every donation — of any size — goes straight to the people who need it. You can pay via M-Pesa or card, and you receive an instant receipt.
                                </p>
                                <p>
                                    <strong className="text-[var(--text-primary)]">Corporate or group giving:</strong> If your company or organisation wants to make a larger contribution, or establish a recurring donation programme, reach out to us directly. We can set up bespoke arrangements that align with your CSR goals.
                                </p>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href="/explore">
                                    <Button variant="primary" className="gap-2 font-bold">
                                        <Heart className="w-4 h-4" fill="currentColor" /> Browse Projects
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" className="font-semibold">Corporate Giving Enquiry</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                            <Image
                                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80"
                                alt="Giving to a cause"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Volunteer ── */}
            <section id="volunteer" className="py-16 md:py-20 bg-[var(--bg-secondary)] border-y border-[var(--border-light)] scroll-mt-24">
                <div className="container-custom max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="md:order-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Act</span>
                            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2 mb-5 leading-snug">
                                Volunteer With Us
                            </h2>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p>
                                    Unity Bridge Kenya runs almost entirely on the goodwill of volunteers. If you have time, skills, or energy to contribute — we want to hear from you. Our current needs include:
                                </p>
                            </div>
                            <ul className="mt-5 space-y-3">
                                {[
                                    "Project outreach and beneficiary identification",
                                    "Photography and storytelling for project pages",
                                    "Social media and community management",
                                    "Tech support (web development, data management)",
                                    "Legal, finance, and compliance advisory (pro bono)",
                                ].map(item => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                                        <CheckCircle2 className="w-4 h-4 text-[var(--primary-green)] shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link href="/contact">
                                    <Button variant="primary" className="gap-2 font-bold">
                                        <UserPlus className="w-4 h-4" /> Get in Touch to Volunteer
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] md:order-1">
                            <Image
                                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80"
                                alt="Volunteers working together"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Partner ── */}
            <section id="partner" className="py-16 md:py-20 scroll-mt-24">
                <div className="container-custom max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Partner</span>
                            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2 mb-5 leading-snug">
                                Become an Organisational Partner
                            </h2>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p>
                                    We are actively looking for NGOs, community organisations, schools, hospitals, and churches that can help us identify and verify genuine needs on the ground.
                                </p>
                                <p>
                                    If you are a business that wants to align your brand with a transparent, community-driven cause — we are open to co-branded fundraising campaigns, staff engagement programmes, and other collaborative arrangements.
                                </p>
                                <p className="text-sm italic">
                                    We are early-stage, honest about that, and actively building our partner network. If you believe in what we are doing, now is a great time to join us.
                                </p>
                            </div>
                            <div className="mt-8">
                                <Link href="/contact">
                                    <Button variant="primary" className="gap-2 font-bold">
                                        <Handshake className="w-4 h-4" /> Enquire About Partnering
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                            <Image
                                src="/organisational-partnership.png"
                                alt="Community partnership"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Host a Fundraiser ── */}
            <section id="fundraise" className="py-16 md:py-20 bg-[var(--bg-secondary)] border-t border-[var(--border-light)] scroll-mt-24">
                <div className="container-custom max-w-4xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Fundraise</span>
                    <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2 mb-4">Host a Fundraiser</h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mb-8">
                        Are you organising an event — a dinner, a run, a workplace drive — and want to channel proceeds to a verified project? We can work with you to set up a dedicated campaign page and provide materials to promote it. Reach out and we will make it happen.
                    </p>
                    <div className="p-6 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-light)] max-w-lg mx-auto">
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            <strong className="text-[var(--text-primary)]">Self-hosted fundraisers</strong> (coming soon): We are building the infrastructure for verified individuals to host fundraising pages on behalf of Unity Bridge Kenya. Watch this space.
                        </p>
                        <Link href="/contact">
                            <Button variant="outline" className="gap-2 font-semibold w-full">
                                Contact Us About a Fundraiser <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Share ── */}
            <section id="share" className="py-16 md:py-20 scroll-mt-24">
                <div className="container-custom max-w-4xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Share</span>
                    <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2 mb-4">Spread the Word</h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mb-10">
                        Sometimes the most powerful thing you can do is tell someone about us. Share Unity Bridge Kenya with your network and help us reach donors who want to give with confidence.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-5 text-left">
                        {[
                            {
                                icon: "💬",
                                title: "Share on WhatsApp",
                                desc: "Send our link to your contacts, family groups, or church chats.",
                                href: "https://wa.me/?text=Support+Unity+Bridge+Kenya+%F0%9F%87%B0%F0%9F%87%AA+https://unitybridgeke.org",
                                external: true,
                                label: "Share via WhatsApp",
                            },
                            {
                                icon: "📘",
                                title: "Share on Facebook",
                                desc: "Post about a project you care about and tag us.",
                                href: "https://facebook.com/sharer/sharer.php?u=https://unitybridgeke.org",
                                external: true,
                                label: "Share on Facebook",
                            },
                            {
                                icon: "📧",
                                title: "Tell Someone Today",
                                desc: "Forward our website to a colleague, friend, or employer who gives.",
                                href: "mailto:?subject=Support%20Unity%20Bridge%20Kenya&body=I%20thought%20you%27d%20want%20to%20know%20about%20this%20organisation%20doing%20great%20work%20in%20Kenya%3A%20https%3A%2F%2Funitybridgeke.org",
                                external: true,
                                label: "Share via Email",
                            },
                        ].map(({ icon, title, desc, href, label }) => (
                            <a key={title} href={href} target="_blank" rel="noopener noreferrer"
                                className="group p-5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl hover:border-[var(--primary-green)]/40 transition-colors">
                                <span className="text-3xl block mb-3">{icon}</span>
                                <h3 className="font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary-green)] transition-colors">{title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{desc}</p>
                                <span className="text-xs font-bold text-[var(--primary-green)] flex items-center gap-1">
                                    {label} <ArrowRight className="w-3 h-3" />
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-12 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]">
                <div className="container-custom max-w-2xl text-center">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">Any questions?</h2>
                    <p className="text-[var(--text-secondary)] mb-6">We are always happy to talk through how you can get involved.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/contact"><Button variant="primary" className="font-bold gap-2">Contact Us <ArrowRight className="w-4 h-4" /></Button></Link>
                        <Link href="/explore"><Button variant="outline" className="font-semibold">Browse Projects</Button></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

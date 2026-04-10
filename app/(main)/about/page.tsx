import Link from "next/link";
import Image from "next/image";
import { Heart, Users, Target, Eye, CheckCircle2, ArrowRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "About Us | Unity Bridge Kenya",
    description: "Learn about Unity Bridge Kenya — who we are, our mission, vision, values, and the small but passionate team behind the organisation.",
};

const VALUES = [
    { icon: "🔍", title: "Transparency", body: "Every shilling donated is accounted for. We publish how funds are distributed and ensure donors can see the impact of their giving." },
    { icon: "🤝", title: "Accountability", body: "We take responsibility for every project we feature. Our verification process ensures funds reach those who genuinely need them." },
    { icon: "🌱", title: "Dignity", body: "Every beneficiary is treated with respect and dignity. We uplift — we do not demean — and we tell stories that honour, not exploit." },
    { icon: "🇰🇪", title: "Community", body: "We are Kenyans serving Kenyans. We understand the social fabric of our communities and work within it, not against it." },
    { icon: "✨", title: "Impact", body: "Good intentions are not enough. We measure outcomes, track progress, and constantly ask: did this actually make life better?" },
];

const TEAM: { name: string; role: string; bio: string; initials: string }[] = [
    {
        name: "Stephen Munene Wagura",
        role: "Founder",
        initials: "SMW",
        bio: "Unity Bridge Kenya was founded in 2026 by Stephen Munene Wagura, who saw first-hand how financial hardship derails lives — a student dropping out over unpaid school fees, a family liquidating assets for a medical bill. He built this platform to make giving easier and more trustworthy. Our team is small, volunteer-driven, and growing.",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">

            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-16 md:py-24 border-b border-[var(--border-light)]">
                <div className="container-custom text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-sm font-semibold mb-6">
                        <Heart className="w-4 h-4" fill="currentColor" /> About Us
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                        Who We Are
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                        A small team of Kenyans building a bridge between those who want to give and those who need it most.
                    </p>
                </div>
            </section>

            {/* ── Our Story ── */}
            <section id="story" className="py-16 md:py-20">
                <div className="container-custom max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Our Story</span>
                            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2 mb-5 leading-snug">
                                Born from seeing hardship up close
                            </h2>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p>
                                    Unity Bridge Kenya was founded in early 2026 by Stephen Munene Wagura, who was frustrated by a recurring scene: a family that needed help, a community that wanted to give — but no trusted, easy way to connect the two.
                                </p>
                                <p>
                                    School fees go unpaid, medical bills pile up, and emergencies strike without warning. Beyond personal crises, our communities face environmental challenges: roads are often dirty with clogged drainages due to littering, and the general environment suffers from widespread waste. Meanwhile, well-meaning donors hesitate because they cannot verify where their money will go. This gap — between generosity and trust — is what Unity Bridge Kenya exists to close.
                                </p>
                                <p>
                                    We verify every project before it goes live, provide regular progress updates to donors, and ensure that disbursed funds are tracked and reported. We are just getting started, but our commitment to integrity and impact is unwavering.
                                </p>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href="/explore">
                                    <Button variant="primary" className="gap-2 font-bold">
                                        Browse Projects <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href="/accountability">
                                    <Button variant="outline" className="gap-2 font-semibold">
                                        How We Work
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                            <Image
                                src="/site-images/community-unity.png"
                                alt="Community members coming together"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-4 left-4 bg-[var(--primary-green)] text-white rounded-xl px-4 py-3">
                                <div className="text-2xl font-extrabold font-mono">2026</div>
                                <div className="text-xs font-semibold">Year Founded</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Mission & Vision ── */}
            <section id="mission" className="py-16 md:py-20 bg-[var(--bg-secondary)] border-y border-[var(--border-light)]">
                <div className="container-custom max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="bg-[var(--bg-primary)] rounded-2xl p-8 border border-[var(--border-light)]">
                            <div className="w-12 h-12 rounded-xl bg-[var(--primary-green)]/10 flex items-center justify-center mb-5">
                                <Target className="w-6 h-6 text-[var(--primary-green)]" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-4">Our Mission</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                                To bridge the gap between generous Kenyans and verified charitable projects — making it simple, safe, and transparent to fund education, healthcare, emergencies, and community development across Kenya.
                            </p>
                        </div>
                        <div className="bg-[var(--bg-primary)] rounded-2xl p-8 border border-[var(--border-light)]">
                            <div className="w-12 h-12 rounded-xl bg-[var(--primary-blue)]/10 flex items-center justify-center mb-5">
                                <Eye className="w-6 h-6 text-[var(--primary-blue)]" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-4">Our Vision</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                                A Kenya where no person is left behind due to financial hardship — where every Kenyan with a genuine need can access community support, and every donor can give with complete confidence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Our Values ── */}
            <section id="values" className="py-16 md:py-20">
                <div className="container-custom max-w-6xl">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Our Values</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">What We Stand For</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {VALUES.map(v => (
                            <div key={v.title} className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)] hover:border-[var(--primary-green)]/30 transition-colors">
                                <span className="text-3xl mb-4 block">{v.icon}</span>
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{v.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{v.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Our Team ── */}
            <section id="team" className="py-16 md:py-20 bg-[var(--bg-secondary)] border-t border-[var(--border-light)]">
                <div className="container-custom max-w-4xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Our Team</span>
                    <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2 mb-4">The People Behind Unity Bridge</h2>
                    <p className="text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
                        We are a lean, passionate team of Kenyans who believe in the power of community. Our team is volunteer-driven in these early stages, and we are actively growing.
                    </p>
                    <div className="max-w-lg mx-auto bg-[var(--bg-primary)] rounded-2xl p-8 border border-[var(--border-light)] text-left">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--primary-green)]/10 flex items-center justify-center text-2xl font-extrabold text-[var(--primary-green)] mb-4">
                            SMW
                        </div>
                        <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">Stephen Munene Wagura</h3>
                        <p className="text-xs text-[var(--primary-green)] font-semibold uppercase tracking-wider mb-3">Founder</p>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            Unity Bridge Kenya was founded in 2026 by Stephen Munene Wagura, who saw first-hand how financial hardship derails lives — a student dropping out over unpaid school fees, a family losing everything to a medical bill. Our team is small, volunteer-driven, and growing. We welcome anyone passionate about changing this narrative.
                        </p>
                    </div>
                    <div className="mt-8">
                        <Link href="/volunteer">
                            <Button variant="primary" className="gap-2 font-bold">
                                <Users className="w-4 h-4" /> Join Our Team
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-16 border-t border-[var(--border-light)]">
                <div className="container-custom max-w-3xl text-center">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">Ready to make a difference?</h2>
                    <p className="text-[var(--text-secondary)] mb-6">Browse verified projects and donate with confidence today.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/donate"><Button variant="primary" className="font-bold gap-2"><Heart className="w-4 h-4" fill="currentColor" /> Donate Now</Button></Link>
                        <Link href="/contact"><Button variant="outline" className="font-semibold">Contact Us</Button></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

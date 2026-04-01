import Link from "next/link";
import Image from "next/image";
import { Leaf, ArrowRight, Trash2, Droplets, Building2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Restoring Our Environment | Unity Bridge Kenya",
    description:
        "Help Unity Bridge Kenya clean up Kenya — collecting litter from informal dumpsites, unclogging roadside drainage channels, and revitalising public parks, markets, schools, and community buildings.",
};

const ACTIVITIES = [
    {
        icon: Trash2,
        color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
        title: "Open-Area Litter Collection",
        body: "We organise coordinated drives to remove solid waste from open fields and informal dumpsites, rescuing shared spaces for the community.",
    },
    {
        icon: Droplets,
        color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        title: "Drainage Channel Restoration",
        body: "Our teams clear roadside drains of debris and rubbish. This ensures water flows freely during rainy seasons, preventing flooding and water damage.",
    },
    {
        icon: Building2,
        color: "text-green-600 bg-green-50 dark:bg-green-900/20",
        title: "Public Space Revitalisation",
        body: "We revitalise schools, markets, and parks through deep-cleaning and repair. We also repaint structures to restore dignity to public facilities.",
    },
];

const CURRENT_AMOUNT = 0;
const TARGET_AMOUNT = 800000;
const PROGRESS = Math.round((CURRENT_AMOUNT / TARGET_AMOUNT) * 100);

export default function RestoringOurEnvironmentPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">

            {/* ── Hero ── */}
            <section className="relative py-28 md:py-44 lg:py-52 overflow-hidden flex items-center min-h-[70vh]">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/environment-hero.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-green)]/25 via-transparent to-transparent" />

                <div className="container-custom relative z-10 max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                        <Leaf className="w-4 h-4 text-green-400" />
                        Community · Environmental Restoration
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Restoring Our{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-[#22d3ee]">
                            Environment
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl leading-relaxed">
                        Cleaning up Kenya — one dumpsite, one drain, one public park at a time.
                        Join us in making our communities healthier and more dignified for everyone.
                    </p>

                    <Link href="/donate?project=restoring-our-environment">
                        <Button variant="primary" size="lg" className="shadow-xl shadow-green-900/40">
                            <Heart className="w-5 h-5" fill="currentColor" />
                            Support This Project
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>



            {/* ── About the Project ── */}
            <section className="py-16 md:py-20">
                <div className="container-custom max-w-4xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">About This Project</span>
                    <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2 mb-6 leading-snug">
                        Kenya&apos;s public spaces deserve better
                    </h2>
                    <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-base">
                        <p>
                            Across Kenya, informal dumpsites have taken hold in open fields and neglected areas. Roadside drainage channels are often choked with rubbish, becoming flood hazards during the rainy season. Meanwhile, many public parks, markets, and schools go without the basic upkeep they deserve.
                        </p>
                        <p>
                            Through our <strong className="text-[var(--text-primary)]">Restoring Our Environment</strong> initiative, we organise
                            coordinated, volunteer-led clean-up drives that tackle all three of these challenges in one concerted effort.
                            Every shilling raised funds equipment, protective gear, transport, and materials for our teams on the ground.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Activity Areas ── */}
            <section className="py-10 md:py-16 bg-[var(--bg-secondary)] border-y border-[var(--border-light)]">
                <div className="container-custom max-w-4xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">What We Do</span>
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mt-2 mb-8">Three Areas of Action</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {ACTIVITIES.map(({ icon: Icon, color, title, body }) => (
                            <div
                                key={title}
                                className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-light)] hover:border-[var(--primary-green)]/30 transition-colors"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-[var(--text-primary)] mb-2 text-base">{title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Impact Image ── */}
            <section className="py-16 md:py-20">
                <div className="container-custom max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                            <Image
                                src="/volunteers-cleaning.png"
                                alt="Volunteers cleaning a public space in Kenya"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-4 left-4 bg-[var(--primary-green)] text-white rounded-xl px-4 py-3">
                                <div className="text-xl font-extrabold">Volunteer-Led</div>
                                <div className="text-xs font-semibold">100% community-driven</div>
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">Why It Matters</span>
                            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mt-2 mb-4 leading-snug">
                                Clean spaces build healthier, safer communities
                            </h2>
                            <div className="space-y-3 text-[var(--text-secondary)] text-sm leading-relaxed">
                                <p>Litter and blocked drains are not just eyesores — they are public health hazards. Stagnant water breeds mosquitoes. Overflowing waste contaminates water sources. Neglected public spaces breed insecurity.</p>
                                <p>Our clean-up drives create immediate, visible impact that communities can see and feel — and they build the culture of environmental stewardship that makes that impact last.</p>
                            </div>
                            <div className="mt-8">
                                <Link href="/donate?project=restoring-our-environment">
                                    <Button variant="primary" className="gap-2 font-bold">
                                        <Heart className="w-4 h-4" fill="currentColor" />
                                        Donate to This Project
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="py-14 bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-blue)] text-white">
                <div className="container-custom text-center max-w-2xl">
                    <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
                        Help Us Clean Up Kenya
                    </h2>
                    <p className="text-white/85 text-base md:text-lg mb-8">
                        Your contribution funds equipment, protective gear, transport, and materials for our volunteer clean-up teams across Kenya.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/donate?project=restoring-our-environment">
                            <Button variant="secondary" size="lg" className="bg-white text-[var(--primary-green)] hover:bg-gray-100 font-bold">
                                Donate Now
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/explore">
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                                Browse All Projects
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

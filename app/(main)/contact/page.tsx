import Link from "next/link";
import Image from "next/image";
import {
    Mail, Phone, MapPin, MessageSquare, Clock,
    ChevronDown, ArrowRight, Heart, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Contact Us | Unity Bridge Kenya",
    description: "Get in touch with Unity Bridge Kenya. We respond to every message. Find our contact details, location, and answers to frequently asked questions.",
};

const FAQS = [
    {
        q: "How do I know my donation is safe?",
        a: "All payments are processed via Flutterwave, a PCI-DSS compliant payment provider. Your card or M-Pesa details are never stored on our servers. Every transaction generates a reference number you can use to verify the donation.",
    },
    {
        q: "Can I donate anonymously?",
        a: "Yes — when making a donation you will see a checkbox to donate anonymously. Your name will not be displayed publicly, though we do need your contact details for payment processing purposes.",
    },
    {
        q: "How do I get a receipt for my donation?",
        a: "An email receipt is sent automatically to the email address you provide during checkout. If you did not receive one, please check your spam folder or contact us with your transaction reference.",
    },
    {
        q: "What happens if a campaign does not reach its goal?",
        a: "We continue fundraising beyond the deadline if needed — campaigns stay open until the need is met or circumstances change. Donors are notified of any significant updates. We do not automatically refund donations if a goal is not reached.",
    },
    {
        q: "Are donations tax-deductible?",
        a: "Unity Bridge Kenya is currently in the process of obtaining formal NGO registration and tax exemption status in Kenya. At this stage, we cannot issue documents for tax deduction purposes. We will update this as our legal status matures.",
    },
    {
        q: "Can corporates or organisations donate?",
        a: "Absolutely. We welcome corporate donations and CSR partnerships. Please reach out via email to discuss bespoke giving options, including bulk donations, employee giving programmes, and formal partnership agreements.",
    },
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">

            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-[var(--primary-green)]/10 via-[var(--bg-secondary)] to-[var(--bg-primary)] py-16 md:py-20 border-b border-[var(--border-light)]">
                <div className="container-custom text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] text-sm font-semibold mb-6">
                        <MessageSquare className="w-4 h-4" /> Contact Us
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                        We Would Love to Hear From You
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                        Whether you have a question, want to learn more, or are interested in partnering with us — we read and respond to every message.
                    </p>
                </div>
            </section>

            {/* ── Contact methods + image ── */}
            <section className="py-16 md:py-20">
                <div className="container-custom max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-start">

                        {/* Left: contact cards */}
                        <div className="space-y-5">
                            <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">How to Reach Us</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                We are a small team and we handle all communications ourselves — so when you reach out, you speak directly with the people running Unity Bridge Kenya.
                            </p>

                            <div className="space-y-4 mt-6">
                                <div className="flex items-start gap-4 p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]">
                                    <div className="w-11 h-11 rounded-xl bg-[var(--primary-green)]/10 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-[var(--primary-green)]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-primary)] mb-1">Email</p>
                                        <a href="mailto:support@unitybridgeke.org" className="text-sm text-[var(--primary-green)] hover:underline font-medium">
                                            support@unitybridgeke.org
                                        </a>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">We aim to reply within 2 business days.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]">
                                    <div className="w-11 h-11 rounded-xl bg-[var(--primary-green)]/10 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-[var(--primary-green)]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-primary)] mb-1">WhatsApp / Phone</p>
                                        <a href="https://wa.me/254700000000" className="text-sm text-[var(--primary-green)] hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                                            0740 797 404
                                        </a>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">Available Monday – Friday, 9 am – 6 pm EAT.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]">
                                    <div className="w-11 h-11 rounded-xl bg-[var(--primary-green)]/10 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-[var(--primary-green)]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-primary)] mb-1">Response Time</p>
                                        <p className="text-sm text-[var(--text-secondary)]">We are a lean, volunteer-driven team. We respond to all enquiries within <strong>2 business days</strong> — usually sooner.</p>
                                    </div>
                                </div>

                                <div id="location" className="flex items-start gap-4 p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] scroll-mt-24">
                                    <div className="w-11 h-11 rounded-xl bg-[var(--primary-green)]/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-[var(--primary-green)]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-primary)] mb-1">Based In</p>
                                        <p className="text-sm text-[var(--text-secondary)]">Nairobi, Kenya</p>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">We operate nationally and do not currently have a walk-in office. All consultations are by appointment.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: image */}
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                            <Image
                                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"
                                alt="Team collaborating"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-5 left-5 text-white">
                                <p className="text-lg font-extrabold leading-tight">Real people,</p>
                                <p className="text-lg font-extrabold leading-tight">real conversations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="py-16 md:py-20 bg-[var(--bg-secondary)] border-y border-[var(--border-light)] scroll-mt-24">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-green)]">FAQs</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">Frequently Asked Questions</h2>
                        <p className="text-[var(--text-secondary)] mt-3">Can&apos;t find your answer here? Email us and we will reply within 2 business days.</p>
                    </div>
                    <div className="space-y-3">
                        {FAQS.map(({ q, a }) => (
                            <details key={q} className="group bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl overflow-hidden">
                                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer font-semibold text-[var(--text-primary)] list-none hover:text-[var(--primary-green)] transition-colors">
                                    <span>{q}</span>
                                    <ChevronDown className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-200" />
                                </summary>
                                <div className="px-6 pb-5 pt-1">
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-12 border-t border-[var(--border-light)]">
                <div className="container-custom max-w-2xl text-center">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">Ready to make a difference?</h2>
                    <p className="text-[var(--text-secondary)] mb-6">Browse our verified projects and start supporting a cause that matters.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/donate"><Button variant="primary" className="gap-2 font-bold"><Heart className="w-4 h-4" fill="currentColor" /> Donate Now</Button></Link>
                        <Link href="/accountability"><Button variant="outline" className="font-semibold">How We Work</Button></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

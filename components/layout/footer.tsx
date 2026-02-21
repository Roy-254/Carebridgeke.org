"use client";

import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[var(--bg-tertiary)] py-12 border-t border-[var(--border-light)]">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Heart className="w-6 h-6 text-[var(--primary-green)]" fill="currentColor" />
                            <span className="font-bold text-[var(--text-primary)]">Care Bridge Kenya</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Building bridges of hope across Kenya, one campaign at a time.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                            <li><Link href="/explore" className="hover:text-[var(--primary-green)]">Explore Campaigns</Link></li>
                            <li><Link href="/#how-it-works" className="hover:text-[var(--primary-green)]">How It Works</Link></li>
                            <li><Link href="/#about" className="hover:text-[var(--primary-green)]">About Us</Link></li>
                            <li><Link href="/faq" className="hover:text-[var(--primary-green)]">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                            <li><Link href="/contact" className="hover:text-[var(--primary-green)]">Contact Us</Link></li>
                            <li><Link href="/help" className="hover:text-[var(--primary-green)]">Help Center</Link></li>
                            <li><Link href="/trust-safety" className="hover:text-[var(--primary-green)]">Trust & Safety</Link></li>
                            <li><Link href="/terms" className="hover:text-[var(--primary-green)]">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-4">Connect</h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">support@carebridgekenya.com</p>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">+254 700 000 000</p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center hover:bg-[var(--primary-green)] hover:text-white transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center hover:bg-[var(--primary-green)] hover:text-white transition-colors">
                                <Share2 className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--border-light)] text-center text-sm text-[var(--text-secondary)]">
                    <p>&copy; {new Date().getFullYear()} Care Bridge Kenya. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

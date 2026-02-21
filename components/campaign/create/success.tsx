"use client";

import React from "react";
import {
    BadgeCheck,
    Share2,
    Home,
    List,
    Twitter,
    Facebook,
    MessageCircle,
    Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function SuccessView() {
    return (
        <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-fade-in">
            <div className="flex justify-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 bg-[var(--primary-green)] text-white rounded-full flex items-center justify-center shadow-xl shadow-[var(--primary-green)]/20"
                >
                    <BadgeCheck className="w-14 h-14" />
                </motion.div>
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
                    Campaign Submitted Successfully!
                </h1>
                <p className="text-lg text-[var(--text-secondary)]">
                    Great job! Our team will review your campaign details within the next <b>24-48 hours</b>. We'll notify you via email once it's live.
                </p>
            </div>

            <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] space-y-6">
                <p className="font-bold text-[var(--text-primary)]">Share while you wait</p>
                <div className="flex justify-center gap-4">
                    <button className="p-3 bg-blue-400 text-white rounded-full hover:scale-110 transition-transform"><Twitter className="w-5 h-5" /></button>
                    <button className="p-3 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform"><Facebook className="w-5 h-5" /></button>
                    <button className="p-3 bg-green-500 text-white rounded-full hover:scale-110 transition-transform"><MessageCircle className="w-5 h-5" /></button>
                    <button className="p-3 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-light)] rounded-full hover:scale-110 transition-transform"><Copy className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full h-12 gap-2 text-lg">
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Button>
                </Link>
                <Link href="/dashboard/campaigns" className="flex-1">
                    <Button variant="primary" className="w-full h-12 gap-2 text-lg">
                        <List className="w-5 h-5" />
                        View My Campaigns
                    </Button>
                </Link>
            </div>
        </div>
    );
}

"use client";

import Link from 'next/link';
import { ArrowLeft, Construction, Clock, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface ComingSoonProps {
    title: string;
    description?: string;
    category?: string;
}

export default function ComingSoon({
    title,
    description = "We are currently meticulously crafting this section to ensure it meets our standards of excellence. Perfection takes time, and we appreciate your patience.",
    category = "Coming Soon"
}: ComingSoonProps) {
    return (
        <main className="relative min-h-screen bg-off-white overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brushed-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-0"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-midnight-navy/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-0"></div>

            <Navbar />

            <section className="relative flex min-h-[70vh] items-center justify-center px-6 py-24 z-10">
                <div className="max-w-3xl w-full text-center">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 bg-midnight-navy/[0.03] border border-midnight-navy/5 px-4 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-3 h-3 text-brushed-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-midnight-navy/60">{category}</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-7xl font-serif text-midnight-navy mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                        {title}
                        <span className="block italic text-midnight-navy/30 mt-2">Under Refinement</span>
                    </h1>

                    <div className="h-px w-24 bg-brushed-gold/30 mx-auto mb-10 animate-in fade-in zoom-in duration-1000 delay-200"></div>

                    {/* Description */}
                    <p className="text-sm md:text-base text-midnight-navy/60 leading-relaxed max-w-xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        {description}
                    </p>

                    {/* Stats/Icons Row */}
                    <div className="flex justify-center gap-12 mb-16 animate-in fade-in duration-1000 delay-500">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-midnight-navy/5 shadow-sm flex items-center justify-center">
                                <Construction className="w-5 h-5 text-brushed-gold/50" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/40">In Development</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-midnight-navy/5 shadow-sm flex items-center justify-center">
                                <Clock className="w-5 h-5 text-brushed-gold/50" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/40">Spring 2026</span>
                        </div>
                    </div>

                    {/* Back Link */}
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-midnight-navy/80 hover:text-brushed-gold transition-all group"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

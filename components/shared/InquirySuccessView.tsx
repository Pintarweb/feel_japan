"use client";

import { CheckCircle2, CalendarHeart } from 'lucide-react';
import Link from 'next/link';

interface InquirySuccessViewProps {
    onReset: () => void;
}

export default function InquirySuccessView({ onReset }: InquirySuccessViewProps) {
    return (
        <section id="inquiry-form" className="max-w-3xl mx-auto py-24 px-6 relative z-10">
            <div
                className="bg-white rounded-[2rem] border-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-12 md:p-16 text-center animate-in fade-in zoom-in duration-700 relative overflow-hidden"
                data-umami-event="inquiry-success"
            >
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brushed-gold/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-midnight-navy/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-brushed-gold/20 to-brushed-gold/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-brushed-gold/10">
                        <CheckCircle2 className="w-10 h-10 text-brushed-gold" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-serif text-midnight-navy mb-4">Brilliantly Done.</h2>

                    <p className="text-lg md:text-xl text-midnight-navy/70 mb-8 font-light">
                        Our travel designers have received your bespoke request.
                    </p>

                    <div className="inline-flex items-center gap-3 bg-midnight-navy/5 rounded-full px-5 py-2.5 mb-10">
                        <CalendarHeart className="w-4 h-4 text-brushed-gold" />
                        <span className="text-[11px] uppercase tracking-widest font-bold text-midnight-navy pt-0.5">
                            Expect our response within 24 hours
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-3.5 bg-midnight-navy text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-transform hover:-translate-y-0.5 shadow-lg shadow-midnight-navy/20 hover:shadow-midnight-navy/40"
                        >
                            Return Home
                        </Link>
                        <button
                            onClick={onReset}
                            className="w-full sm:w-auto px-8 py-3.5 bg-white text-midnight-navy border border-midnight-navy/10 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors hover:bg-midnight-navy/5"
                        >
                            New Request
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";

import { CheckCircle2 } from 'lucide-react';

interface InquirySuccessViewProps {
    onReset: () => void;
}

export default function InquirySuccessView({ onReset }: InquirySuccessViewProps) {
    return (
        <section id="inquiry-form" className="max-w-4xl mx-auto py-24 px-6">
            <div
                className="bg-white rounded-[3rem] border border-midnight-navy/5 shadow-2xl p-16 text-center animate-in fade-in zoom-in duration-700"
                data-umami-event="inquiry-success"
            >
                <div className="w-20 h-20 bg-brushed-gold/10 rounded-full flex items-center justify-center mx-auto mb-10">
                    <CheckCircle2 className="w-10 h-10 text-brushed-gold" />
                </div>

                <h2 className="text-4xl font-serif font-bold italic text-midnight-navy mb-6">Request Logged</h2>

                <div className="max-w-md mx-auto space-y-6">
                    <p className="text-sm leading-relaxed text-midnight-navy/70">
                        Your bespoke travel architecture request has been successfully transmitted to our travel designers.
                    </p>

                    <div className="h-px w-12 bg-brushed-gold/30 mx-auto"></div>

                    <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-midnight-navy/70 leading-loose">
                        Due to high demand for curated itineraries, requests are processed in chronological order.
                        You will receive a formal response within 24-48 business hours.
                    </p>
                </div>

                <div className="mt-12">
                    <button
                        onClick={onReset}
                        className="text-[10px] uppercase tracking-widest font-bold text-brushed-gold hover:text-midnight-navy transition-colors border-b border-brushed-gold/20 pb-1"
                    >
                        Log Another Request
                    </button>
                </div>
            </div>
        </section>
    );
}

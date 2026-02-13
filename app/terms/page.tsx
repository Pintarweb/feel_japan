"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, UserCheck, ScrollText, AlertTriangle, Scale, Ban } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="relative min-h-screen bg-off-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-midnight-navy">
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                {/* Atmosphere Glow */}
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-midnight-navy/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 -z-0"></div>

                <div className="relative z-20 text-center max-w-4xl px-6">
                    <span className="text-brushed-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">Legal Documentation</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white font-medium mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                        Terms <span className="italic text-white/90">of</span> Service
                    </h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Effective Date: February 2026</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
                <div className="space-y-16">
                    {/* Intro */}
                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-midnight-navy/80 leading-relaxed font-light italic border-l-2 border-brushed-gold/30 pl-8 mb-12">
                            "This agreement defines the professional parameters of our collaboration, ensuring a standardized of excellence and mutual protection in the delivery of Japanese travel experiences."
                        </p>
                    </div>

                    {/* Section 1 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-midnight-navy/5 flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-brushed-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-midnight-navy">B2B Partner Eligibility</h2>
                        </div>
                        <div className="text-midnight-navy/70 space-y-4 leading-relaxed text-sm">
                            <p>Access to the Feel Japan with K Partner Studio is restricted to certified travel professionals. By registering, you warrant that:</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-brushed-gold">
                                <li>You are a legally registered travel agency or licensed independent consultant.</li>
                                <li>The information provided during onboarding is accurate and current.</li>
                                <li>You will maintain the confidentiality of your Studio access credentials.</li>
                                <li>You are authorized to enter into binding agreements on behalf of your agency.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-midnight-navy/5 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-brushed-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-midnight-navy">Intellectual Property & Usage</h2>
                        </div>
                        <div className="text-midnight-navy/70 space-y-4 leading-relaxed text-sm">
                            <p>All travel architecture, brochure designs, and visual assets within the Studio remain the exclusive property of Feel Japan with K.</p>
                            <p>Partners are granted a limited, non-transferable license to utilize these materials for the sole purpose of presenting travel options to their direct clients. Modification of itineraries, removal of brand identifiers (unless using the 'Client-Ready' toggle), or unauthorized redistribution of confidential net rates is strictly prohibited.</p>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-midnight-navy/5 flex items-center justify-center">
                                <ScrollText className="w-5 h-5 text-brushed-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-midnight-navy">Booking & Cancellation Architecture</h2>
                        </div>
                        <div className="text-midnight-navy/70 space-y-4 leading-relaxed text-sm">
                            <p>Specific booking terms, tiered pricing schedules, and cancellation policies are detailed within each individual brochure. In the event of a conflict, the terms specified on the digital brochure at the time of inquiry shall prevail.</p>
                            <p>Feel Japan with K reserves the right to adjust net rates based on seasonal demand, currency fluctuations, or significant changes in local hospitality costs.</p>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-midnight-navy/5 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-brushed-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-midnight-navy">Limitation of Liability</h2>
                        </div>
                        <div className="text-midnight-navy/70 space-y-4 leading-relaxed text-sm">
                            <p>While we strive for perfection in every itinerary, Feel Japan with K shall not be held liable for disruptions beyond our control, including but not limited to force majeure events, transport delays, or changes in local regulations in Japan.</p>
                            <p>Our liability is limited to the professional coordination of services as detailed in the agreed-upon final itinerary.</p>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-midnight-navy/5 flex items-center justify-center">
                                <Ban className="w-5 h-5 text-brushed-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-midnight-navy">Termination of Access</h2>
                        </div>
                        <div className="text-midnight-navy/70 space-y-4 leading-relaxed text-sm">
                            <p>We reserve the right to suspend or terminate Partner Studio access without notice if a partner is found to be in violation of these professional standards, misusing confidential pricing information, or engaging in conduct detrimental to the brand reputation of Feel Japan with K.</p>
                        </div>
                    </div>

                    {/* Section 6 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-midnight-navy/5 flex items-center justify-center">
                                <Scale className="w-5 h-5 text-brushed-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-midnight-navy">Governing Law</h2>
                        </div>
                        <div className="text-midnight-navy/70 space-y-4 leading-relaxed text-sm">
                            <p>These terms and any professional collaboration between parties shall be governed by and construed in accordance with the laws of Malaysia, with non-exclusive jurisdiction granted to the courts of Kuala Lumpur for any matters of dispute.</p>
                        </div>
                    </div>

                    {/* Final Branding Disclaimer */}
                    <div className="pt-12 border-t border-midnight-navy/5 text-center">
                        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-midnight-navy/30 mb-6">Execution of Professional Standards</p>
                        <p className="text-sm text-midnight-navy/60">
                            Feel Japan with K • Travel & Tours<br />
                            Kuala Lumpur Headquarters
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

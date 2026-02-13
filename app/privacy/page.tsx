"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Eye, Lock, Globe } from "lucide-react";

export default function PrivacyPage() {
    return (
        <main className="relative min-h-screen bg-off-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-midnight-navy">
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                {/* Atmosphere Glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brushed-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-0"></div>

                <div className="relative z-20 text-center max-w-4xl px-6">
                    <span className="text-brushed-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">Legal Documentation</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white font-medium mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                        Privacy <span className="italic text-white/90">&</span> Data Protection
                    </h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Last Updated: February 2026</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
                <div className="space-y-16">
                    {/* Intro */}
                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-midnight-navy/80 leading-relaxed font-light italic border-l-2 border-brushed-gold/30 pl-8 mb-12">
                            "Transparency is the cornerstone of trust in the luxury travel industry. At Feel Japan with K, we are committed to safeguarding the professional and personal data entrusted to us by our B2B partners."
                        </p>
                    </div>

                    {/* Section 1 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-midnight-navy/5 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-brushed-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-midnight-navy">Collection of Information</h2>
                        </div>
                        <div className="text-midnight-navy/70 space-y-4 leading-relaxed text-sm">
                            <p>We collect information necessary to provide ultra-bespoke travel architecture and partner support. This includes:</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-brushed-gold">
                                <li><strong>Partner Identity:</strong> Name, professional designation, agency details, and travel agent license numbers.</li>
                                <li><strong>Travel Architecture:</strong> Client preferences (pax, dates, budget) and specific itinerary requests submitted through our inquiry portal.</li>
                                <li><strong>Digital Footprint:</strong> IP addresses and session data to optimize the Partner Studio experience and prevent unauthorized access.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-midnight-navy/5 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-brushed-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-midnight-navy">Use of Data</h2>
                        </div>
                        <div className="text-midnight-navy/70 space-y-4 leading-relaxed text-sm">
                            <p>Your data is processed exclusively for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-brushed-gold">
                                <li>Facilitating seamless communication between our travel designers and your agency.</li>
                                <li>Generating client-ready presentation materials with correct partner branding.</li>
                                <li>Ensuring compliance with international travel regulations and Japanese hospitality standards.</li>
                                <li>Personalizing your Studio Portal with seasonal offers relevant to your market.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-midnight-navy/5 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-brushed-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-midnight-navy">Security Protocols</h2>
                        </div>
                        <div className="text-midnight-navy/70 space-y-4 leading-relaxed text-sm">
                            <p>We employ state-of-the-art encryption and security measures to protect your professional assets. Data is stored on secured servers with restricted access limited to authorized personnel only.</p>
                            <p>We utilize the <strong>Supabase Architecture</strong> for robust authentication and database security, ensuring that your inquiries and partner details remain confidential.</p>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-midnight-navy/5 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-brushed-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-midnight-navy">Your Rights</h2>
                        </div>
                        <div className="text-midnight-navy/70 space-y-4 leading-relaxed text-sm">
                            <p>As a verified B2B partner, you maintain full control over your data. You may at any time:</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-brushed-gold">
                                <li>Access and update your professional profile within the Studio.</li>
                                <li>Request a complete export of your past inquiries and communications.</li>
                                <li>Opt-out of seasonal bulletin updates and marketing disclosures.</li>
                                <li>Request the permanent deletion of your partner account and associated records.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Disclaimer */}
                    <div className="pt-12 border-t border-midnight-navy/5 text-center">
                        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-midnight-navy/30 mb-6">Inquiries regarding Privacy</p>
                        <p className="text-sm text-midnight-navy/60">
                            For matters regarding data protection, please contact our legal concierge at:<br />
                            <span className="text-midnight-navy font-bold mt-2 block">legal@feeljapan.com</span>
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}


import { Metadata } from 'next';
import { getBrochures } from '@/lib/services/brochureService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PartnerResourcesGrid from '@/components/sections/PartnerResourcesGrid';

export const metadata: Metadata = {
    title: 'Partner Resources | Feel Japan with K',
    description: 'Exclusive digital brochure library for travel partners and travel agents.',
};

export default async function PartnerResourcesPage() {
    const brochures = await getBrochures();

    return (
        <main className="min-h-screen bg-off-white">
            <Navbar />

            {/* Hero Section - Pure Professionalism */}
            <section className="relative pt-32 pb-24 bg-[#FAFAFA] border-b border-midnight-navy/5 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.2]">
                    <Image
                        src="/b2b_collection_banner.png"
                        alt="Background Pattern"
                        fill
                        className="object-cover brightness-[0.85]"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brushed-gold/5 border border-brushed-gold/10 mb-6 group cursor-default">
                        <ShieldCheck className="w-4 h-4 text-brushed-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brushed-gold">
                            Authorized Partner Resource Center
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-midnight-navy mb-6">
                        Digital Brochure Library
                    </h1>
                    <p className="text-midnight-navy/60 max-w-2xl mx-auto font-light leading-relaxed">
                        Access our complete 2026 collection of curated itineraries. Designed specifically for travel agents to download, customize, and share with your discerning clients.
                    </p>
                </div>
            </section>

            {/* Library Grid - Organized by Category */}
            <PartnerResourcesGrid brochures={brochures} />

            {/* Newsletter / Contact Section for Partners */}
            <section className="bg-white border-y border-midnight-navy/5 py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-serif text-midnight-navy mb-6">Need a Bespoke Itinerary?</h2>
                    <p className="text-midnight-navy/60 font-light mb-10 leading-relaxed">
                        If our standard collection doesn't quite fit your group's requirements, our team is ready to craft a custom experience for your organization.
                    </p>
                    <Link
                        href="/inquire"
                        className="inline-flex items-center gap-3 bg-brushed-gold text-white px-10 py-5 rounded-sm text-xs font-bold uppercase tracking-[0.2em] hover:bg-midnight-navy transition-all duration-500 shadow-xl"
                    >
                        Request Custom Design
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}

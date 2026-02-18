
import { Metadata } from 'next';
import { getBrochures } from '@/lib/services/brochureService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Download, FileText, MapPin, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Partner Resources | Feel Japan with K',
    description: 'Exclusive digital brochure library for travel partners and travel agents.',
};

const SUPABASE_STORAGE_URL = 'https://mcjsjztxvnscdasaqxym.supabase.co/storage/v1/object/public/brochures';

export default async function PartnerResourcesPage() {
    const brochures = await getBrochures();

    return (
        <main className="min-h-screen bg-off-white">
            <Navbar />

            {/* Hero Section - Pure Professionalism */}
            <section className="relative pt-32 pb-24 bg-white border-b border-midnight-navy/5 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.15]">
                    <Image
                        src="/b2b_collection_banner.png"
                        alt="Background Pattern"
                        fill
                        className="object-cover"
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

            {/* Library Grid */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {brochures.map((brochure) => {
                        const pdfUrl = `${SUPABASE_STORAGE_URL}/brochure/${brochure.category.toLowerCase()}_${brochure.slug}.pdf`;
                        const pricingPdfUrl = `${SUPABASE_STORAGE_URL}/brochure-pricing/${brochure.category.toLowerCase()}_${brochure.slug}_pricing.pdf`;

                        return (
                            <article key={brochure.id} className="bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group border border-midnight-navy/5">
                                {/* Thumbnail */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                    <Image
                                        src={brochure.thumbnail_url || brochure.image}
                                        alt={brochure.title}
                                        fill
                                        className="object-cover object-top transition-transform duration-[2s] group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-midnight-navy/90 backdrop-blur-md text-brushed-gold text-[9px] font-bold uppercase tracking-widest rounded-sm">
                                            {brochure.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-midnight-navy/50 text-[10px] uppercase tracking-widest mb-3">
                                        <MapPin className="w-3 h-3 text-brushed-gold" />
                                        {Array.isArray(brochure.city) ? brochure.city.join(', ') : brochure.city}
                                    </div>
                                    <h3 className="text-2xl font-serif text-midnight-navy mb-4 group-hover:text-brushed-gold transition-colors leading-snug">
                                        {brochure.title}
                                    </h3>
                                    <p className="text-sm text-midnight-navy/60 font-light mb-8 line-clamp-3 leading-relaxed">
                                        {brochure.summary || brochure.subtitle}
                                    </p>

                                    {/* Actions */}
                                    <div className="mt-auto space-y-3">
                                        {brochure.pdf_last_generated_at ? (
                                            <a
                                                href={pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-midnight-navy text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-brushed-gold transition-all duration-300 shadow-md group-hover:shadow-lg"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                Download Client PDF
                                            </a>
                                        ) : (
                                            <div className="w-full py-4 bg-gray-100 text-midnight-navy/30 text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                Preparing Digital PDF
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                href={`/brochures/${brochure.slug}`}
                                                className="flex items-center justify-center gap-1.5 py-3 border border-midnight-navy/10 text-midnight-navy text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-colors"
                                            >
                                                <Globe className="w-3 h-3" />
                                                Online View
                                            </Link>
                                            {brochure.pdf_last_generated_at ? (
                                                <a
                                                    href={pricingPdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1.5 py-3 border border-brushed-gold/30 text-brushed-gold text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-brushed-gold/5 transition-colors"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    Agent Rates
                                                </a>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1.5 py-3 border border-gray-200 text-gray-400 text-[9px] font-bold uppercase tracking-widest rounded-sm cursor-not-allowed">
                                                    <FileText className="w-3 h-3" />
                                                    Pending
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

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

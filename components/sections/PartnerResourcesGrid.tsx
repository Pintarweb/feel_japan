"use client";

import React, { useState } from 'react';
import { Download, FileText, MapPin, Globe, ShieldCheck, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Brochure } from '@/types/brochure';

const SUPABASE_STORAGE_URL = 'https://mcjsjztxvnscdasaqxym.supabase.co/storage/v1/object/public/brochures';

interface PartnerResourcesGridProps {
    brochures: Brochure[];
}

export default function PartnerResourcesGrid({ brochures }: PartnerResourcesGridProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBrochure, setSelectedBrochure] = useState<Brochure | null>(null);
    const [pricingPdfUrl, setPricingPdfUrl] = useState<string>("");

    // Form state
    const [companyName, setCompanyName] = useState("");
    const [contactName, setContactName] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenModal = (brochure: Brochure, url: string) => {
        setSelectedBrochure(brochure);
        setPricingPdfUrl(url);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBrochure(null);
        setPricingPdfUrl("");
        setCompanyName("");
        setContactName("");
        setEmail("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/pricing-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: companyName,
                    contact_name: contactName,
                    email,
                    brochure_slug: selectedBrochure?.slug
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit request.");
            }

            // Success, open pdf and close form
            window.open(pricingPdfUrl, '_blank');
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting form", error);
            alert("There was an error processing your request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24 max-w-7xl mx-auto px-6 relative">
            {['GIT', 'FIT', 'Seasonal'].map((cat) => {
                const categorizedBrochures = brochures.filter(b => b.category.toUpperCase() === cat.toUpperCase());
                if (categorizedBrochures.length === 0) return null;

                return (
                    <div key={cat} className="mb-24 last:mb-0">
                        {/* Category Header */}
                        <div className="flex items-center gap-4 mb-12">
                            <h2 className="text-2xl font-serif text-midnight-navy flex items-center gap-3">
                                <span className="w-12 h-[1px] bg-brushed-gold/30"></span>
                                {cat === 'GIT' ? 'Group Inclusive Tours (GIT)' :
                                    cat === 'FIT' ? 'Free Independent Travels (FIT)' :
                                        'Limited Seasonal Explorations'}
                            </h2>
                            <span className="bg-midnight-navy/5 text-midnight-navy/40 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                {categorizedBrochures.length} Itineraries
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {categorizedBrochures.map((brochure) => {
                                const pdfUrl = `${SUPABASE_STORAGE_URL}/brochure/${brochure.category.toLowerCase()}_${brochure.slug}.pdf`;
                                const pricingPdfUrlVal = `${SUPABASE_STORAGE_URL}/brochure-pricing/${brochure.category.toLowerCase()}_${brochure.slug}_pricing.pdf`;

                                return (
                                    <article key={brochure.id} className="bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group border border-midnight-navy/5">
                                        {/* Thumbnail */}
                                        <div className="relative aspect-[3/4] overflow-hidden bg-white font-serif">
                                            <Image
                                                src={brochure.thumbnail_url || brochure.image}
                                                alt={brochure.title}
                                                fill
                                                className="object-cover object-top transition-transform duration-[2s] group-hover:scale-105 brightness-[1.05]"
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
                                                        <button
                                                            onClick={() => handleOpenModal(brochure, pricingPdfUrlVal)}
                                                            className="flex items-center justify-center gap-1.5 py-3 border border-brushed-gold/30 text-brushed-gold text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-brushed-gold/5 transition-colors"
                                                        >
                                                            <FileText className="w-3 h-3" />
                                                            Agent Rates
                                                        </button>
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
                    </div>
                );
            })}

            {/* Modal */}
            {isModalOpen && selectedBrochure && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-navy/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-midnight-navy/40 hover:text-midnight-navy p-2 rounded-full hover:bg-midnight-navy/5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            <h3 className="text-2xl font-serif text-midnight-navy mb-2">Request Agent Rates</h3>
                            <p className="text-sm text-midnight-navy/60 mb-6 pb-6 border-b border-midnight-navy/5">
                                Please provide your details to access the exclusive pricing for this itinerary.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Selected Itinerary</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={`[${selectedBrochure.category}] ${selectedBrochure.title}`}
                                        className="w-full bg-midnight-navy/5 text-midnight-navy/60 border border-midnight-navy/10 rounded-lg px-4 py-3 text-sm cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Company / Agency Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="e.g. Travel With Style Sdn Bhd"
                                        className="w-full bg-white text-midnight-navy border border-midnight-navy/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brushed-gold transition-all placeholder:text-midnight-navy/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Contact Person</label>
                                    <input
                                        type="text"
                                        required
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                        placeholder="e.g. Sarah Ahmad"
                                        className="w-full bg-white text-midnight-navy border border-midnight-navy/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brushed-gold transition-all placeholder:text-midnight-navy/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="e.g. sarah@travelwithstyle.com"
                                        className="w-full bg-white text-midnight-navy border border-midnight-navy/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brushed-gold transition-all placeholder:text-midnight-navy/20"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-brushed-gold text-white py-4 rounded-xl text-sm font-bold tracking-[0.2em] uppercase shadow-lg shadow-brushed-gold/30 hover:shadow-brushed-gold/50 flex justify-center items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Access Pricing PDF'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

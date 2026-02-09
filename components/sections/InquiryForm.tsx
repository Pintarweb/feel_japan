"use client";

import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { brochures } from '@/data/brochures';

export default function InquiryForm() {
    const searchParams = useSearchParams();
    const [selectedPackage, setSelectedPackage] = useState("");

    useEffect(() => {
        const pkg = searchParams.get('package');
        if (pkg) {
            setSelectedPackage(decodeURIComponent(pkg));
        }
    }, [searchParams]);

    return (
        <section id="inquire" className="bg-[#f5f5f5] px-8 py-16 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-10 -mt-6">
            <div className="text-center mb-10">
                <h4 className="text-midnight-navy text-2xl font-serif font-bold mb-3">Request a Custom Quote</h4>
                <p className="text-midnight-navy/60 text-xs tracking-widest uppercase">B2B Agent Inquiry</p>
            </div>

            <form className="space-y-5 max-w-md mx-auto">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Agency Name</label>
                    <input
                        type="text"
                        placeholder="Luxury Travels Co."
                        className="w-full bg-white text-midnight-navy border border-midnight-navy/10 rounded-lg px-4 py-4 focus:outline-none focus:ring-1 focus:ring-brushed-gold focus:border-brushed-gold transition-all placeholder:text-midnight-navy/20"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Pax</label>
                    <input
                        type="number"
                        placeholder="Number of Guests"
                        className="w-full bg-white text-midnight-navy border border-midnight-navy/10 rounded-lg px-4 py-4 focus:outline-none focus:ring-1 focus:ring-brushed-gold focus:border-brushed-gold transition-all placeholder:text-midnight-navy/20"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Travel Dates</label>
                    <input
                        type="text"
                        placeholder="DD/MM/YYYY - DD/MM/YYYY"
                        className="w-full bg-white text-midnight-navy border border-midnight-navy/10 rounded-lg px-4 py-4 focus:outline-none focus:ring-1 focus:ring-brushed-gold focus:border-brushed-gold transition-all placeholder:text-midnight-navy/20"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Interested Brochure</label>
                    <div className="relative">
                        <select
                            value={selectedPackage}
                            onChange={(e) => setSelectedPackage(e.target.value)}
                            className="w-full bg-white text-midnight-navy border border-midnight-navy/10 rounded-lg px-4 py-4 focus:outline-none focus:ring-1 focus:ring-brushed-gold focus:border-brushed-gold appearance-none cursor-pointer transition-all"
                        >
                            <option value="" disabled>Select a collection</option>
                            {brochures.map((b) => (
                                <option key={b.id} value={b.slug}>{b.title}</option>
                            ))}
                            <option value="custom">Other / Custom Request</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brushed-gold">
                            <ChevronDown className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                    <div className="flex items-center h-5">
                        <input id="newsletter-optin" name="newsletter-optin" type="checkbox" className="h-5 w-5 rounded border-midnight-navy/20 text-brushed-gold focus:ring-brushed-gold accent-brushed-gold" />
                    </div>
                    <label htmlFor="newsletter-optin" className="text-[11px] leading-tight text-midnight-navy/70 font-medium">
                        Keep me updated on new brochures and exclusive corporate itineraries.
                    </label>
                </div>

                <button type="submit" className="w-full bg-brushed-gold text-white py-4 mt-2 rounded-lg text-xs font-bold tracking-widest uppercase shadow-xl shadow-brushed-gold/30 hover:shadow-brushed-gold/40 active:scale-[0.98] transition-all">
                    Submit Inquiry
                </button>
            </form>

        </section>
    );
}

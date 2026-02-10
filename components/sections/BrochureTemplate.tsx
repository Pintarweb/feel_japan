"use client";

import { MapPin, Calendar, Check, Utensils, Hotel, Bus, Train, Plane, Star, Camera, Mountain, ShoppingBag, Footprints, Droplet, UserCheck, Map } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Brochure, Activity } from '@/types/brochure';
import React from 'react';

// Icon mapping helper
const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
        MapPin, Calendar, Check, Utensils, Hotel, Bus, Train, Plane, Star, Camera, Mountain, ShoppingBag, Footprints, Droplet, UserCheck, Map
    };
    const IconComponent = icons[iconName] || MapPin;
    return <IconComponent className="w-5 h-5 text-brushed-gold flex-shrink-0" />;
};

// Simplified parser for bold text (**text**)
const parseDescription = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

interface BrochureTemplateProps {
    brochure: Brochure;
}

export default function BrochureTemplate({ brochure }: BrochureTemplateProps) {
    // Rely on parent check to avoid hydration mismatch on early null return
    // if (!brochure) return null;

    const formattedAdultPrice = new Intl.NumberFormat('en-US').format(brochure.pricing.tiers[0]?.adultPrice || 0);

    return (
        <div className="bg-white min-h-screen">
            <Navbar hideInquiry={true} />

            {/* Hero Section */}
            <header className="relative h-[60vh] flex flex-col items-center justify-center text-center text-white px-4">
                <div className="absolute inset-0">
                    <img
                        src={brochure.image}
                        alt={brochure.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 animate-fade-in-up">
                    <span className="block text-brushed-gold text-sm font-bold tracking-[0.3em] uppercase mb-4">
                        {brochure.subtitle.includes('Summer') ? 'Summer 2026' : (brochure.subtitle.split('•').pop()?.trim() || "Season")}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold mb-8 tracking-[0.2em] hero-text-shadow uppercase opacity-95">{brochure.title}</h2>
                    <p className="text-xl md:text-2xl font-light mb-8 opacity-90 hero-text-shadow tracking-widest">
                        {brochure.subtitle.includes('•')
                            ? brochure.subtitle.split('•').slice(0, -1).join(' • ').trim()
                            : brochure.subtitle}
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                        <span className="bg-japan-red text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg uppercase tracking-widest">{brochure.tags.type}</span>
                        <span className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold shadow-lg uppercase tracking-widest">{brochure.tags.pax}</span>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-16">

                {/* Itinerary Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-midnight-navy mb-4">The Journey</h2>
                    <div className="h-1 w-20 bg-brushed-gold mx-auto"></div>
                </div>

                <div className="space-y-4">
                    {brochure.itinerary.map((day, index) => (
                        <div key={index} className={`flex flex-col md:flex-row gap-8 group p-8 rounded-3xl transition-colors ${index % 2 === 1 ? 'bg-midnight-navy/5' : 'hover:bg-midnight-navy/5'}`}>
                            <div className="md:w-32 flex-shrink-0">
                                <div className="sticky top-24">
                                    <span className="block text-brushed-gold font-serif text-4xl leading-none mb-2">{String(day.day).padStart(2, '0')}</span>
                                    <span className="text-xs font-bold text-midnight-navy/40 uppercase tracking-widest">Day</span>
                                </div>
                            </div>
                            <div className="flex-grow border-l border-midnight-navy/10 pl-8 pb-4 relative group-last:border-l-0">
                                {/* Dot */}
                                <div className={`absolute -left-1.5 top-2 w-3 h-3 rounded-full ring-4 ring-white transition-all ${index % 2 === 1 ? 'bg-midnight-navy/20 group-hover:bg-brushed-gold' : 'bg-brushed-gold group-hover:ring-transparent'}`}></div>

                                <h3 className={`text-xl font-bold uppercase tracking-wide mb-2 ${index === brochure.itinerary.length - 1 ? 'text-midnight-navy/60' : 'text-midnight-navy'}`}>{day.title}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest mb-6 ${index === brochure.itinerary.length - 1 ? 'text-midnight-navy/40' : 'text-brushed-gold'}`}>{day.meals}</p>

                                {day.description && (
                                    <p className="text-sm font-semibold text-midnight-navy/60 mb-4 italic">{day.description}</p>
                                )}

                                <ul className="space-y-4">
                                    {day.activities.map((activity, actIndex) => (
                                        <li key={actIndex} className={`flex gap-4 text-sm leading-relaxed ${activity.description.includes('End of Service') ? 'text-midnight-navy/60 italic' : 'text-midnight-navy/80'}`}>
                                            {getIcon(activity.icon)}
                                            <span>{parseDescription(activity.description)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Estimated Pricing Section */}
                <section className="mb-20 mt-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif text-midnight-navy mb-4">Estimated Pricing</h2>
                        <div className="h-1 w-20 bg-brushed-gold mx-auto mb-4"></div>
                        <p className="text-midnight-navy/60 font-medium italic text-sm">{brochure.pricing.title}</p>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-midnight-navy/5">
                        <table className="w-full text-left">
                            <thead className="bg-midnight-navy/5 border-b border-midnight-navy/10">
                                <tr>
                                    <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Pax Count</th>
                                    <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Adult</th>
                                    <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Child (CWB)</th>
                                    <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Child (CNB)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-midnight-navy/5 font-medium text-sm text-midnight-navy/80">
                                {brochure.pricing.tiers.map((tier, index) => (
                                    <tr key={index}>
                                        <td className="px-8 py-5">{tier.pax}</td>
                                        <td className="px-8 py-5 text-brushed-gold font-bold">{new Intl.NumberFormat('en-US').format(tier.adultPrice)}</td>
                                        <td className="px-8 py-5">{tier.childPriceWithBed ? new Intl.NumberFormat('en-US').format(tier.childPriceWithBed) : '--'}</td>
                                        <td className="px-8 py-5 opacity-40">{tier.childPriceNoBed ? new Intl.NumberFormat('en-US').format(tier.childPriceNoBed) : '--'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-center text-[10px] text-midnight-navy/40 mt-4 font-bold uppercase tracking-widest italic">{brochure.pricing.surchargeNote}</p>
                </section>

                {/* Inclusions & Exclusions */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* Inclusions */}
                    <div className="bg-white p-10 rounded-lg shadow-lg border-l-4 border-brushed-gold flex flex-col">
                        <h3 className="text-2xl font-serif text-midnight-navy mb-8 flex items-center gap-3">
                            <Check className="text-brushed-gold" /> What's Included
                        </h3>
                        <ul className="space-y-4 text-sm font-medium text-midnight-navy/70 leading-relaxed">
                            {brochure.inclusions.map((item, index) => (
                                <li key={index} className="flex gap-4">
                                    <Check className="w-5 h-5 flex-shrink-0 text-brushed-gold" />
                                    <span>{parseDescription(item)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Exclusions */}
                    <div className="bg-midnight-navy text-white p-10 rounded-lg shadow-2xl flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <div className="w-64 h-64 border-8 border-white rounded-full"></div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mb-6 flex items-center gap-3">
                                What's Excluded
                            </h3>
                            <ul className="space-y-3 text-xs font-bold text-white/60 italic mb-8">
                                {brochure.exclusions.map((item, index) => (
                                    <li key={index}>• {item}</li>
                                ))}
                            </ul>

                            <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-brushed-gold border-t border-white/10 pt-6 uppercase tracking-tight">
                                Payment Terms
                            </h3>
                            <div className="space-y-4 text-xs font-semibold opacity-90 leading-relaxed">
                                <div>
                                    <p className="text-brushed-gold uppercase font-black mb-1">Deposit (Non-Refundable)</p>
                                    <p>{brochure.paymentTerms.deposit}</p>
                                </div>
                                <div>
                                    <p className="text-brushed-gold uppercase font-black mb-1">Final Payment</p>
                                    <p>{brochure.paymentTerms.finalPayment}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Inquiry CTA */}
            <a
                href={`/inquire?package=${encodeURIComponent(brochure.slug)}`}
                className="fixed bottom-52 right-8 z-50 inline-flex items-center gap-3 bg-brushed-gold text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-midnight-navy transition-colors shadow-2xl hover:shadow-brushed-gold/20 transform hover:-translate-y-1 border-2 border-white/10"
            >
                <MapPin className="w-4 h-4" />
                <span>Request Quote</span>
            </a>

            <Footer />
        </div>
    );
}

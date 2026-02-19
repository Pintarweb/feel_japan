"use client";

import { MapPin, Calendar, Check, Utensils, Hotel, Bus, Train, Plane, Star, Camera, Mountain, ShoppingBag, Footprints, Droplet, UserCheck, Map, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Brochure, Activity } from '@/types/brochure';
import React, { useState, useEffect } from 'react';

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
    isAgent?: boolean;
    agentProfile?: any;
}

export default function BrochureTemplate({ brochure, isAgent = false, agentProfile }: BrochureTemplateProps) {
    const [showNetRates, setShowNetRates] = useState(false);

    // Initialize toggle state based on agent status
    useEffect(() => {
        if (agentProfile?.is_admin) {
            setShowNetRates(true);
        }
    }, [agentProfile]);

    const pricing = brochure.pricing || { title: "", tiers: [], surchargeNote: "" };
    const tiers = pricing.tiers || [];
    const subtitle = brochure.subtitle || "";

    // Combined logic: Show pricing if (Public & show_pricing is true) OR (Agent & showNetRates is true)
    // Selective Launch: Only show if admin
    const isAdmin = agentProfile?.is_admin === true;
    const displayPricing = isAdmin;

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <header className="relative h-[60vh] flex flex-col items-center justify-center text-center text-white px-4">
                <div className="absolute inset-0">
                    <img
                        src={brochure.image}
                        alt={brochure.title}
                        className="h-full w-full object-cover brightness-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
                </div>

                <div className="relative z-10 animate-fade-in-up">
                    <span className="block text-brushed-gold text-sm font-bold tracking-[0.3em] uppercase mb-4 drop-shadow-md">
                        {subtitle.includes('Summer') ? 'Summer 2026' : (subtitle.split('•').pop()?.trim() || "Season")}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold mb-8 tracking-[0.2em] uppercase text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] opacity-100">{brochure.title}</h2>
                    <p className="text-xl md:text-2xl font-light mb-8 opacity-100 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-widest">
                        {subtitle.includes('•')
                            ? subtitle.split('•').slice(0, -1).join(' • ').trim()
                            : subtitle}
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

                <div className="space-y-4 mb-20">
                    {brochure.itinerary.map((day, index) => (
                        <div key={index} className={`flex flex-col md:flex-row gap-8 group p-8 rounded-3xl transition-colors ${index % 2 === 1 ? 'bg-midnight-navy/5' : 'hover:bg-midnight-navy/5'}`}>
                            <div className="md:w-32 flex-shrink-0">
                                <div className="sticky top-24">
                                    <span className="block text-brushed-gold font-serif text-4xl leading-none mb-2">{String(day.day).padStart(2, '0')}</span>
                                    <span className="text-xs font-bold text-midnight-navy/70 uppercase tracking-widest">Day</span>
                                </div>
                            </div>
                            <div className="flex-grow border-l border-midnight-navy/10 pl-8 pb-4 relative group-last:border-l-0">
                                {/* Dot */}
                                <div className={`absolute -left-1.5 top-2 w-3 h-3 rounded-full ring-4 ring-white transition-all ${index % 2 === 1 ? 'bg-midnight-navy/20 group-hover:bg-brushed-gold' : 'bg-brushed-gold group-hover:ring-transparent'}`}></div>

                                <h3 className={`text-xl font-bold uppercase tracking-wide mb-2 ${index === brochure.itinerary.length - 1 ? 'text-midnight-navy/85' : 'text-midnight-navy'}`}>{day.title}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest mb-6 ${index === brochure.itinerary.length - 1 ? 'text-midnight-navy/70' : 'text-brushed-gold'}`}>{day.meals}</p>

                                {day.description && (
                                    <p className="text-sm font-semibold text-midnight-navy/85 mb-4 italic">{day.description}</p>
                                )}

                                <ul className="space-y-4">
                                    {day.activities.map((activity, actIndex) => (
                                        <li key={actIndex} className={`flex gap-4 text-sm leading-relaxed ${activity.description.includes('End of Service') ? 'text-midnight-navy/85 italic' : 'text-midnight-navy/80'}`}>
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
                {displayPricing && (
                    <section className="mb-20">
                        {isAgent && (
                            <div className="flex justify-center mb-8">
                                <button
                                    onClick={() => setShowNetRates(!showNetRates)}
                                    className="bg-midnight-navy text-brushed-gold px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 border border-brushed-gold/30 hover:bg-brushed-gold hover:text-midnight-navy transition-all shadow-xl group"
                                >
                                    {showNetRates ? (
                                        <>
                                            <EyeOff className="w-4 h-4" />
                                            Switch to Client-Ready View
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4" />
                                            Reveal Agent Net Rates
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif text-midnight-navy mb-4">Estimated Pricing</h2>
                            <div className="h-1 w-20 bg-brushed-gold mx-auto mb-4"></div>
                            <p className="text-midnight-navy/85 font-medium italic text-sm">{pricing.title}</p>
                        </div>

                        <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-midnight-navy/5">
                            <table className="w-full text-left">
                                <thead className="bg-midnight-navy/5 border-b border-midnight-navy/10">
                                    <tr>
                                        <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Pax Count</th>
                                        {(pricing.displayColumns || ['adult', 'cwb', 'cnb']).includes('adult') && <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Adult</th>}
                                        {(pricing.displayColumns || ['adult', 'cwb', 'cnb']).includes('cwb') && <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Child (CWB)</th>}
                                        {(pricing.displayColumns || ['adult', 'cwb', 'cnb']).includes('cnb') && <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Child (CNB)</th>}
                                        {(pricing.displayColumns || ['adult', 'cwb', 'cnb']).includes('single') && <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Single</th>}
                                        {(pricing.displayColumns || ['adult', 'cwb', 'cnb']).includes('vehicle') && <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Vehicle</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-midnight-navy/5 font-medium text-sm text-midnight-navy/80">
                                    {tiers.map((tier, index) => (
                                        <tr key={index}>
                                            <td className="px-8 py-5">{tier.pax}</td>
                                            {(pricing.displayColumns || ['adult', 'cwb', 'cnb']).includes('adult') && (
                                                <td className="px-8 py-5 text-brushed-gold font-bold">
                                                    {new Intl.NumberFormat('en-US').format(tier.adultPrice || 0)}
                                                </td>
                                            )}
                                            {(pricing.displayColumns || ['adult', 'cwb', 'cnb']).includes('cwb') && (
                                                <td className="px-8 py-5">
                                                    {tier.childPriceWithBed ? new Intl.NumberFormat('en-US').format(tier.childPriceWithBed) : '--'}
                                                </td>
                                            )}
                                            {(pricing.displayColumns || ['adult', 'cwb', 'cnb']).includes('cnb') && (
                                                <td className="px-8 py-5 opacity-40">
                                                    {tier.childPriceNoBed ? new Intl.NumberFormat('en-US').format(tier.childPriceNoBed) : '--'}
                                                </td>
                                            )}
                                            {(pricing.displayColumns || ['adult', 'cwb', 'cnb']).includes('single') && (
                                                <td className="px-8 py-5">
                                                    {tier.singlePrice ? new Intl.NumberFormat('en-US').format(tier.singlePrice) : '--'}
                                                </td>
                                            )}
                                            {(pricing.displayColumns || ['adult', 'cwb', 'cnb']).includes('vehicle') && (
                                                <td className="px-8 py-5 italic text-midnight-navy/60">
                                                    {tier.vehicle || '--'}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="text-center text-[10px] text-midnight-navy/70 mt-4 font-bold uppercase tracking-widest italic">{pricing.surchargeNote}</p>
                    </section>
                )}

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
                            <ul className="space-y-3 text-xs font-bold text-white/85 italic mb-8">
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

                {/* Optional Add-ons Section - Only displays if items exist */}
                {brochure.optional && brochure.optional.length > 0 && (
                    <div className="mb-20 bg-[#fcfcfc] p-10 rounded-[2.5rem] border-2 border-dashed border-midnight-navy/5">
                        <h3 className="text-xl font-serif text-midnight-navy mb-8 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brushed-gold"></div>
                            Optional Arrangements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {brochure.optional.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <span className="text-brushed-gold font-bold text-lg leading-none">+</span>
                                    <p className="text-sm font-medium text-midnight-navy/70 leading-relaxed">
                                        {parseDescription(item)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Final Inquiry CTA - Relocated above footer for better flow */}
            <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
                <a
                    href={`/inquire?package=${encodeURIComponent(brochure.slug)}`}
                    data-umami-event="request-quote-click"
                    data-umami-event-package={brochure.slug}
                    className="inline-flex items-center gap-3 bg-brushed-gold text-white px-12 py-5 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-midnight-navy transition-all duration-500 shadow-2xl hover:shadow-brushed-gold/20 transform hover:-translate-y-1 border-2 border-white/10 group"
                >
                    <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                    <span>Request Quotation</span>
                </a>
                <p className="mt-6 text-[10px] text-midnight-navy/40 uppercase tracking-[0.3em] font-bold">
                    Curate your bespoke Japanese experience
                </p>
            </div>

            {/* Floating Agent Toggle - Persistent presence if admin hasn't revealed */}
            {isAdmin && !showNetRates && (
                <button
                    onClick={() => setShowNetRates(true)}
                    className="fixed bottom-32 right-8 z-50 flex items-center gap-3 bg-midnight-navy text-brushed-gold px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brushed-gold hover:text-midnight-navy transition-all shadow-2xl border-2 border-brushed-gold/30 animate-bounce-slow"
                >
                    <Eye className="w-4 h-4" />
                    Reveal Net Rates
                </button>
            )}

            <Footer />
        </div>
    );
}

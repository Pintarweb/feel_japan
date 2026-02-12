"use client";

import { MapPin, Calendar, Utensils, Star, Share2, ArrowRight, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { Brochure } from '@/types/brochure';

type Category = 'FIT' | 'GIT' | 'Corporate' | 'Seasonal';

interface BrochureGridProps {
    brochures: Brochure[];
}

export default function BrochureGrid({ brochures }: BrochureGridProps) {
    const [activeCategory, setActiveCategory] = useState<Category>('FIT');

    const filteredBrochures = brochures.filter(b => b.category === activeCategory).map(b => {
        const cityTags = Array.isArray(b.city)
            ? b.city.map(c => ({ label: c, icon: MapPin, color: 'text-midnight-navy/60' }))
            : [{ label: b.city as string, icon: MapPin, color: 'text-midnight-navy/60' }];

        // Determine icon based on category
        let CategoryIcon = Star;
        if (b.category === 'GIT') CategoryIcon = Utensils;
        if (b.category === 'Seasonal') CategoryIcon = Calendar;

        return {
            id: b.id,
            title: b.title,
            description: b.summary || b.subtitle,
            image: b.image,
            link: `/brochures/${encodeURIComponent(b.slug)}`,
            tags: [
                { label: b.category, icon: CategoryIcon, color: 'text-brushed-gold' },
                ...cityTags
            ]
        };
    });

    return (
        <section id="collections" className="py-12 bg-off-white">
            {/* Filter Toggle - Centered and Clean */}
            <div className="px-6 mb-12 text-center relative z-20">
                {/* Main Category Toggle - Luxury Segmented Control */}
                <div className="inline-flex flex-wrap justify-center bg-white p-1.5 rounded-full shadow-[0_4px_20px_-4px_rgba(0,26,51,0.1)] border border-midnight-navy/5 relative gap-1">
                    <button
                        onClick={() => setActiveCategory('FIT')}
                        className={`relative z-10 px-6 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-2 ${activeCategory === 'FIT'
                            ? 'bg-midnight-navy text-brushed-gold shadow-md'
                            : 'text-midnight-navy/50 hover:text-midnight-navy hover:bg-gray-50'
                            }`}
                    >
                        <Star className={`w-3 h-3 transition-colors duration-300 ${activeCategory === 'FIT' ? 'text-brushed-gold' : 'text-midnight-navy/30'}`} />
                        FIT
                    </button>
                    <button
                        onClick={() => setActiveCategory('GIT')}
                        className={`relative z-10 px-6 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-2 ${activeCategory === 'GIT'
                            ? 'bg-midnight-navy text-brushed-gold shadow-md'
                            : 'text-midnight-navy/50 hover:text-midnight-navy hover:bg-gray-50'
                            }`}
                    >
                        <Utensils className={`w-3 h-3 transition-colors duration-300 ${activeCategory === 'GIT' ? 'text-brushed-gold' : 'text-midnight-navy/30'}`} />
                        GIT
                    </button>
                    <button
                        onClick={() => setActiveCategory('Corporate')}
                        className={`relative z-10 px-6 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-2 ${activeCategory === 'Corporate'
                            ? 'bg-midnight-navy text-brushed-gold shadow-md'
                            : 'text-midnight-navy/50 hover:text-midnight-navy hover:bg-gray-50'
                            }`}
                    >
                        <Briefcase className={`w-3 h-3 transition-colors duration-300 ${activeCategory === 'Corporate' ? 'text-brushed-gold' : 'text-midnight-navy/30'}`} />
                        Corporate
                    </button>
                    <button
                        onClick={() => setActiveCategory('Seasonal')}
                        className={`relative z-10 px-6 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-2 ${activeCategory === 'Seasonal'
                            ? 'bg-midnight-navy text-brushed-gold shadow-md'
                            : 'text-midnight-navy/50 hover:text-midnight-navy hover:bg-gray-50'
                            }`}
                    >
                        <Calendar className={`w-3 h-3 transition-colors duration-300 ${activeCategory === 'Seasonal' ? 'text-brushed-gold' : 'text-midnight-navy/30'}`} />
                        Seasonal
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-0">
                {activeCategory === 'Corporate' ? (
                    /* Corporate Showcase Layout */
                    <div className="relative rounded-sm overflow-hidden shadow-2xl bg-white group">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Image Side */}
                            <div className="relative h-[400px] lg:h-[600px] w-full overflow-hidden bg-midnight-navy">
                                <Image
                                    src="/hero_alphard_zen.png"
                                    alt="Executive Corporate Travel"
                                    fill
                                    className="object-contain transition-transform duration-[2s] group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-midnight-navy/20"></div>
                            </div>

                            {/* Content Side */}
                            <div className="flex flex-col justify-center p-8 lg:p-16 bg-white relative">
                                <div className="absolute top-8 right-8 text-brushed-gold/10">
                                    <Briefcase className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-brushed-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block animate-fade-in-up">
                                        Premium B2B Solutions
                                    </span>
                                    <h3 className="text-3xl lg:text-5xl font-serif text-midnight-navy mb-6 leading-tight animate-fade-in-up delay-100">
                                        Executive Corporate Services
                                    </h3>
                                    <div className="space-y-6 text-midnight-navy/70 leading-relaxed font-light animate-fade-in-up delay-200">
                                        <p>
                                            Elevate your corporate engagements in Japan with our bespoke travel management solutions. We specialize in high-touch logistical support for executive delegations, ensuring every moment is optimized for comfort and productivity.
                                        </p>
                                        <ul className="space-y-4 mt-8">
                                            {[
                                                "Dedicated fleet of luxury vehicles (Alphard, Hiace, Coaster)",
                                                "Professional multilingual chauffeur & coordinator support",
                                                "Secure & confidential itinerary management",
                                                "Access to exclusive venues for meetings & dining"
                                            ].map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 bg-brushed-gold rounded-full flex-shrink-0"></span>
                                                    <span className="text-sm md:text-base">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-10 animate-fade-in-up delay-300">
                                        <Link
                                            href="/inquire?package=Corporate"
                                            className="inline-flex items-center gap-3 bg-midnight-navy text-white px-8 py-4 rounded-sm text-xs font-bold tracking-[0.2em] uppercase hover:bg-brushed-gold transition-colors duration-300 shadow-lg"
                                        >
                                            Inquire for Corporate
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Brochure Grid for FIT, GIT, Seasonal */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
                        {filteredBrochures.length > 0 ? (
                            filteredBrochures.map((brochure) => (
                                <article key={brochure.id} className="flex flex-col group h-full">
                                    {/* Image Card */}
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-xl hover:shadow-2xl transition-all duration-500 mb-6">
                                        <div className="absolute inset-0 bg-midnight-navy/10 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                        <img
                                            src={brochure.image}
                                            alt={brochure.title}
                                            className="h-full w-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/80 via-transparent to-transparent opacity-80"></div>

                                        {/* Floating Tag inside image for better space usage on mobile */}
                                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 z-20">
                                            {brochure.tags.map((tag, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white/95 backdrop-blur-sm shadow-sm">
                                                    <tag.icon className={`w-3 h-3 ${tag.color}`} />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy">{tag.label}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow space-y-4">
                                        <div>
                                            <h3 className="text-2xl lg:text-3xl font-serif text-midnight-navy leading-tight mb-2 group-hover:text-brushed-gold transition-colors">{brochure.title}</h3>
                                            <p className="text-sm text-midnight-navy/60 leading-relaxed font-light line-clamp-3">
                                                {brochure.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4">
                                            <Link
                                                href={brochure.link}
                                                className="w-full bg-midnight-navy text-white py-4 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-brushed-gold transition-colors duration-300 flex items-center justify-center gap-2 group-hover:bg-brushed-gold"
                                            >
                                                <ArrowRight className="w-3.5 h-3.5" />
                                                View Packages
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-midnight-navy/40 font-serif italic text-lg">
                                    No brochures available for this category yet.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

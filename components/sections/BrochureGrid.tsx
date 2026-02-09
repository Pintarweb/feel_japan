"use client";

import { MapPin, Calendar, Utensils, Star, Share2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

import { brochures } from '@/data/brochures';

type Category = 'FIT' | 'GIT';

export default function BrochureGrid() {
    const [activeCategory, setActiveCategory] = useState<Category>('FIT');

    const filteredBrochures = brochures.filter(b => b.category === activeCategory).map(b => {
        const cityTags = Array.isArray(b.city)
            ? b.city.map(c => ({ label: c, icon: MapPin, color: 'text-midnight-navy/60' }))
            : [{ label: b.city as string, icon: MapPin, color: 'text-midnight-navy/60' }];

        return {
            id: b.id,
            title: b.title,
            description: b.subtitle,
            image: b.image,
            link: `/brochures/${encodeURIComponent(b.slug)}`,
            tags: [
                { label: b.category, icon: b.category === 'FIT' ? Star : Utensils, color: 'text-brushed-gold' },
                ...cityTags
            ]
        };
    });

    return (
        <section id="collections" className="py-12 bg-off-white">
            {/* Filter Toggle - Centered and Clean */}
            <div className="px-6 mb-12 text-center relative z-20">
                {/* Main Category Toggle - Luxury Segmented Control */}
                <div className="inline-flex bg-white p-1.5 rounded-full shadow-[0_4px_20px_-4px_rgba(0,26,51,0.1)] border border-midnight-navy/5 relative">
                    <button
                        onClick={() => setActiveCategory('FIT')}
                        className={`relative z-10 px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-2 ${activeCategory === 'FIT'
                            ? 'bg-midnight-navy text-brushed-gold shadow-md'
                            : 'text-midnight-navy/50 hover:text-midnight-navy hover:bg-gray-50'
                            }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeCategory === 'FIT' ? 'bg-brushed-gold' : 'bg-midnight-navy/30'}`}></span>
                        Private (FIT)
                    </button>
                    <button
                        onClick={() => setActiveCategory('GIT')}
                        className={`relative z-10 px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-2 ${activeCategory === 'GIT'
                            ? 'bg-midnight-navy text-brushed-gold shadow-md'
                            : 'text-midnight-navy/50 hover:text-midnight-navy hover:bg-gray-50'
                            }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeCategory === 'GIT' ? 'bg-brushed-gold' : 'bg-midnight-navy/30'}`}></span>
                        Group (GIT)
                    </button>
                </div>
            </div>

            {/* Brochure Cards */}
            <div className="px-6 md:px-12 lg:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto">
                {filteredBrochures.map((brochure) => (
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
                                    View Collection
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

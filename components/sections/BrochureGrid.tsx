import { MapPin, Calendar, Utensils, Star, Share2, ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { BROCHURES } from '@/lib/constants';

export default function BrochureGrid() {
    return (
        <section id="collections" className="py-16 bg-off-white">
            {/* Header */}
            <div className="px-6 mb-12">
                <h3 className="text-xs font-bold tracking-[0.5em] text-midnight-navy/40 uppercase mb-3">Portfolio</h3>
                <h2 className="text-4xl font-serif text-midnight-navy leading-tight">
                    B2B Private <br /> Collections
                </h2>
                <p className="text-[10px] text-midnight-navy/40 mt-3 tracking-[0.25em] uppercase">Feel Japan with K</p>
            </div>

            {/* Filters (Horizontal Scroll) */}
            <div className="space-y-10 mb-12">
                {/* Season Filter */}
                <div className="px-6">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="font-serif text-lg text-midnight-navy">Season</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-brushed-gold/40 to-transparent"></div>
                    </div>
                    <div className="flex gap-8 overflow-x-auto pb-2 no-scrollbar pl-1">
                        <button className="group flex flex-col items-center space-y-1 min-w-max">
                            <span className="text-sm font-medium text-midnight-navy">Spring</span>
                            <span className="w-1 h-1 rounded-full bg-brushed-gold"></span>
                        </button>
                        {['Summer', 'Autumn', 'Winter'].map((season) => (
                            <button key={season} className="group flex flex-col items-center space-y-1 min-w-max">
                                <span className="text-sm font-light text-midnight-navy/40 group-hover:text-midnight-navy transition-colors">{season}</span>
                                <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brushed-gold/30"></span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Region Filter */}
                <div className="px-6">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="font-serif text-lg text-midnight-navy">Region</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-brushed-gold/40 to-transparent"></div>
                    </div>
                    <div className="flex gap-8 overflow-x-auto pb-2 no-scrollbar pl-1">
                        <button className="group flex flex-col items-center space-y-1 min-w-max">
                            <span className="text-sm font-medium text-midnight-navy">Kyoto</span>
                            <span className="w-1 h-1 rounded-full bg-brushed-gold"></span>
                        </button>
                        {['Tokyo', 'Osaka', 'Hokkaido'].map((region) => (
                            <button key={region} className="text-sm font-light text-midnight-navy/40 transition-colors min-w-max">{region}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Brochure Cards */}
            <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 md:max-w-7xl md:mx-auto">
                {BROCHURES.map((brochure) => (
                    <article key={brochure.id} className="flex flex-col group">
                        {/* Image Card */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-2xl mb-8">
                            <div className="absolute inset-0 bg-midnight-navy/10 z-10"></div>
                            <img
                                src={brochure.image}
                                alt={brochure.title}
                                className="h-full w-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/60 via-midnight-navy/10 to-transparent opacity-70"></div>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-3">
                                {brochure.tags.map((tag, idx) => (
                                    <span key={idx} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border-l-2 ${tag.border} bg-white shadow-sm`}>
                                        <tag.icon className={`w-3 h-3 ${tag.color}`} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy">{tag.label}</span>
                                    </span>
                                ))}
                            </div>

                            <div>
                                <h3 className="text-3xl font-serif text-midnight-navy leading-snug mb-3">{brochure.title}</h3>
                                <p className="text-sm text-midnight-navy/60 leading-7 font-light">
                                    {brochure.description}
                                </p>
                            </div>

                            <button className="w-full bg-brushed-gold text-white py-5 rounded-sm text-xs font-bold tracking-[0.25em] uppercase shadow-xl shadow-brushed-gold/20 hover:shadow-brushed-gold/30 transition-all flex items-center justify-center gap-3">
                                <ArrowRight className="w-4 h-4" />
                                Explore Brochure
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

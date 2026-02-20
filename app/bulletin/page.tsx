'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from 'next/link';
import { Newspaper, ArrowRight, ExternalLink, ShieldCheck, Zap, Heart, Compass, PlayCircle, X, Info, FileText, Share2 } from "lucide-react";
import WeatherWidget from "@/components/shared/WeatherWidget";
import CurrencyWidget from "@/components/shared/CurrencyWidget";

const B2B_INSIDER_ALERTS = [
    {
        category: "Official Regulatory Alert",
        icon: <Zap className="w-5 h-5 text-amber-500" />,
        title: "Kyoto Lodging Tax Update",
        action: "Action Required: Update Your Kyoto Quotations for 2026",
        summary: "New tiered lodging tax structures coming into effect for premium properties.",
        fullBriefing: "Effective Jan 2026, Kyoto is introducing a tiered lodging tax. Properties above 50,000 JPY/night will see a significant increase. We recommend all Malaysian partners update their 2026 quotations immediately to avoid margin slippage. Feel Japan with K is currently renegotiating group rates with our partner hotels to absorb some of this cost.",
        priority: "CRITICAL",
        url: "#"
    },
    {
        category: "Muslim-Friendly Spotlight",
        icon: <Heart className="w-5 h-5 text-emerald-500" />,
        title: "New Prayer Facilities in Ginza",
        action: "New Muslim-Friendly Resource for Your VIP Clients",
        summary: "Premium Ginza shopping district has opened a central prayer lounge for international travelers.",
        fullBriefing: "The new 'Ginza Serenity Lounge' offers gender-segregated prayer rooms, wudu facilities, and a halal juice bar. Located just 3 minutes from Mitsukoshi. This is a primary selling point for your high-net-worth Muslim clients who skip Ginza due to lack of facilities. Contact us for a pre-printed map of these facilities to include in your welcome packs.",
        priority: "OPPORTUNITY",
        url: "#"
    },
    {
        category: "Seasonal Logistics",
        icon: <Compass className="w-5 h-5 text-blue-500" />,
        title: "2026 Sakura Forecast & Logistics",
        action: "Action Required: Pre-book Private Coaches by October",
        summary: "Early data suggests 15% increase in domestic travel volume during the 2026 Sakura season.",
        fullBriefing: "With the rebound of both domestic and Chinese group travel, coach availability for March/April 2026 is projected to hit critical levels earlier than usual. We are advising our Malaysian partners to secure their group itineraries and deposits by mid-October 2025. We have secured exclusive priority booking for 5 extra 45-seater coaches for our frequent partners.",
        priority: "LOGISTICS",
        url: "#"
    }
];

const NEWS_UPDATES = [
    {
        date: "Feb 9, 2026",
        title: "Malaysian Incentive Travel Trends 2025",
        summary: "JNTO Kuala Lumpur has released the latest insights into corporate and incentive travel preferences for the Malaysian market.",
        takeaway: "High-value data for corporate planners. Use these insights to pitch Japan for MICE groups by aligning with current spending patterns.",
        url: "https://res.cloudinary.com/jnto/image/upload/v1/media/filer_public/05/b0/05b0128a-0a3e-4682-997e-f8c40ad76e9f/malaysian_incentive_travel_trends_2025_gx8sev",
        tag: "Market Intelligence"
    },
    {
        date: "April 2, 2025",
        title: "JNTO HQ Incentive Support Menu FY2025",
        summary: "The official support menu for fiscal year 2025 is now available, offering various subsidies and resources for group travel.",
        takeaway: "Direct support opportunities. Lower your group costs or add exclusive perks by tapping into official JNTO support programs.",
        url: "https://res.cloudinary.com/jnto/image/upload/v1/media/filer_public/89/e5/89e5a146-2c62-4d93-bc95-c03b8a837210/jnto_hq_incentive_support_menu_fy2025_is_now_available_hwr1bs",
        tag: "Incentive Support"
    }
];

export default function BulletinPage() {
    const [selectedAlert, setSelectedAlert] = useState<null | typeof B2B_INSIDER_ALERTS[0]>(null);
    const [showVideo, setShowVideo] = useState(false);
    const [watchlist, setWatchlist] = useState<string[]>([]);

    // Sync watchlist with localStorage
    useEffect(() => {
        const saved = localStorage.getItem('fj_watchlist');
        if (saved) setWatchlist(JSON.parse(saved));
    }, []);

    const toggleWatchlist = (title: string) => {
        const next = watchlist.includes(title)
            ? watchlist.filter(t => t !== title)
            : [...watchlist, title];
        setWatchlist(next);
        localStorage.setItem('fj_watchlist', JSON.stringify(next));
    };

    const handleForward = (alert: typeof B2B_INSIDER_ALERTS[0]) => {
        const text = `*Feel Japan B2B Intelligence*\n\n*${alert.title}*\n${alert.action}\n\nRead more: ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <main className="relative min-h-screen bg-off-white text-midnight-navy">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-white overflow-hidden border-b border-midnight-navy/5">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <Image
                        src="/b2b_collection_banner.png"
                        alt="Background Pattern"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brushed-gold/5 border border-brushed-gold/10 mb-8 cursor-default">
                            <Newspaper className="w-4 h-4 text-brushed-gold" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brushed-gold">
                                Japan Insider Bulletin
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-serif text-midnight-navy mb-8 leading-tight">
                            Strategic <span className="italic font-light text-brushed-gold">Intelligence</span>
                        </h1>
                        <p className="text-xl text-midnight-navy/60 font-light leading-relaxed">
                            Filtering the noise to deliver high-priority signals for our Malaysian travel partners.
                        </p>
                    </div>
                </div>
            </section>

            {/* Fast-Scan Dashboard */}
            <section className="py-20 bg-midnight-navy relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none grayscale invert">
                    <Image src="/b2b_collection_banner.png" alt="" fill className="object-cover" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-white/10"></div>
                        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-brushed-gold">Fast-Scan Intelligence</h2>
                        <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {B2B_INSIDER_ALERTS.map((alert, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-500 group flex flex-col h-full relative">
                                {watchlist.includes(alert.title) && (
                                    <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-brushed-gold/20 rounded-full border border-brushed-gold/30 animate-in zoom-in duration-300">
                                        <div className="w-1.5 h-1.5 bg-brushed-gold rounded-full animate-pulse" />
                                        <span className="text-[8px] font-bold text-brushed-gold uppercase">Saved</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        {alert.icon}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{alert.category}</span>
                                </div>
                                <h3 className="text-xl font-serif text-white mb-4 leading-snug">{alert.title}</h3>
                                <div className="p-4 bg-brushed-gold/10 border-l-2 border-brushed-gold rounded-sm mb-6">
                                    <p className="text-xs font-bold text-brushed-gold uppercase tracking-tighter mb-1">Skill Output:</p>
                                    <p className="text-sm text-white/90 font-medium italic">"{alert.action}"</p>
                                </div>
                                <p className="text-xs text-white/60 leading-relaxed mb-8">{alert.summary}</p>

                                <button
                                    onClick={() => setSelectedAlert(alert)}
                                    className="mt-auto w-full py-3 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg border border-white/5 hover:bg-brushed-gold hover:text-midnight-navy hover:border-brushed-gold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                >
                                    Access Briefing
                                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Insider Briefing Modal */}
            {selectedAlert && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10 antialiased">
                    <div
                        className="absolute inset-0 bg-midnight-navy/90 backdrop-blur-xl animate-in fade-in duration-500"
                        onClick={() => setSelectedAlert(null)}
                    />
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                        {/* Modal Header */}
                        <div className="p-8 md:p-12 bg-gradient-to-br from-[#FDFDFD] to-[#F5F5F5] border-b border-midnight-navy/5">
                            <button
                                onClick={() => setSelectedAlert(null)}
                                className="absolute top-8 right-8 p-2 rounded-full hover:bg-midnight-navy/5 transition-colors group"
                            >
                                <X className="w-6 h-6 text-midnight-navy/40 group-hover:text-midnight-navy transition-colors" />
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="px-3 py-1 rounded-full bg-brushed-gold/10 text-[9px] font-bold text-brushed-gold uppercase tracking-widest border border-brushed-gold/20">
                                    {selectedAlert.priority}
                                </span>
                                <span className="text-[10px] font-bold text-midnight-navy/40 uppercase tracking-widest">{selectedAlert.category}</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-4 leading-tight">
                                {selectedAlert.title}
                            </h2>
                            <p className="text-lg text-brushed-gold font-serif italic mb-0">"{selectedAlert.action}"</p>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 md:p-12">
                            <div className="flex items-start gap-4 mb-8">
                                <div className="p-4 bg-midnight-navy/5 rounded-2xl">
                                    <FileText className="w-6 h-6 text-midnight-navy" />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-midnight-navy/30">Founder's Briefing</h4>
                                    <p className="text-lg text-midnight-navy/80 font-light leading-relaxed">
                                        {selectedAlert.fullBriefing}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-12">
                                <button
                                    onClick={() => handleForward(selectedAlert)}
                                    className="py-4 bg-midnight-navy text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-brushed-gold hover:text-midnight-navy transition-all duration-300 flex items-center justify-center gap-2 group/share"
                                >
                                    <Share2 className="w-4 h-4 group-hover/share:rotate-12 transition-transform" />
                                    Forward to Team
                                </button>
                                <button
                                    onClick={() => toggleWatchlist(selectedAlert.title)}
                                    className={`py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl border transition-all duration-300 ${watchlist.includes(selectedAlert.title)
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-white text-midnight-navy border-midnight-navy/10 hover:border-midnight-navy'
                                        }`}
                                >
                                    {watchlist.includes(selectedAlert.title) ? 'Saved' : 'Add to Watchlist'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Overlay Modal */}
            {showVideo && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-midnight-navy/95 backdrop-blur-2xl animate-in fade-in duration-500"
                        onClick={() => setShowVideo(false)}
                    />
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            title="2026 Japan Travel Guide"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {/* Live Widgets & Video Section */}
            <section className="py-24 bg-[#F8F8F8] border-b border-midnight-navy/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Widgets Pile */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <WeatherWidget />
                                <CurrencyWidget />
                            </div>
                            <div className="relative overflow-hidden group rounded-2xl transition-all duration-700 hover:shadow-[0_20px_50px_rgba(197,160,89,0.15)] bg-midnight-navy flex flex-col justify-between p-10">
                                <div className="absolute -top-10 -right-10 w-64 h-64 bg-brushed-gold/10 rounded-full blur-[100px] group-hover:bg-brushed-gold/20 transition-all duration-1000"></div>
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />

                                <div className="flex justify-between items-start relative z-10">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                            <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/60">Ground Operations Feed</span>
                                        </div>
                                        <h3 className="text-2xl font-serif text-white">Feel Japan Ground Status</h3>
                                    </div>
                                    <ShieldCheck className="w-8 h-8 text-brushed-gold" />
                                </div>

                                <div className="mt-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                                    <div className="max-w-md">
                                        <div className="flex items-baseline gap-3 mb-4">
                                            <span className="text-5xl font-serif text-white uppercase tracking-tighter">Status</span>
                                            <span className="text-5xl font-serif text-emerald-400 italic">Optimal</span>
                                        </div>
                                        <p className="text-white/50 text-sm leading-relaxed">
                                            Our ground support teams in Tokyo, Osaka, and Fukuoka report no operational disruptions. All pre-booked transport and facilities are confirmed at 100% capacity.
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Confidence Level</p>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-1.5 bg-emerald-400 rounded-full" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video / Resource Card */}
                        <div className="lg:col-span-4 h-full">
                            <div className="bg-white rounded-2xl p-8 border border-midnight-navy/5 shadow-xl h-full flex flex-col group">
                                <div
                                    onClick={() => setShowVideo(true)}
                                    className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-midnight-navy group-hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                >
                                    <Image src="/b2b_collection_banner.png" alt="2026 Japan Travel Guide" fill className="object-cover opacity-60 grayscale group-hover:scale-110 transition-transform duration-[3s]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-brushed-gold rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                            <PlayCircle className="w-8 h-8 text-midnight-navy" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-midnight-navy to-transparent">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Critical Watch: 2026</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-serif text-midnight-navy mb-4">What You Need to Know for 2026</h3>
                                <p className="text-sm text-midnight-navy/60 leading-relaxed mb-8">
                                    Essential updates including new tax-free rules, lodging taxes, and transport changes critical for Malaysian travel agencies.
                                </p>
                                <ul className="space-y-4 mb-10 mt-auto">
                                    {['Tax-Free Rule Changes', 'Lodging Tax Tiering', 'JR Pass Strategic Updates'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-midnight-navy/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brushed-gold" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => setShowVideo(true)}
                                    className="w-full py-4 bg-midnight-navy text-white text-xs font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-brushed-gold hover:text-midnight-navy transition-all duration-300"
                                >
                                    Watch Full Briefing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Intelligence Feed */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-16">
                    <h2 className="text-3xl font-serif text-midnight-navy">Market Intelligence Feed</h2>
                    <div className="h-px flex-1 bg-midnight-navy/5 mx-8 hidden md:block"></div>
                    <Link href="/contact" className="text-xs font-bold text-brushed-gold uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">Request Specific Data Port</Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {NEWS_UPDATES.map((news, i) => (
                        <article
                            key={i}
                            className="group flex flex-col md:flex-row bg-white rounded-2xl border border-midnight-navy/5 shadow-sm hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                        >
                            <div className="p-10 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] font-bold text-brushed-gold/60 uppercase tracking-widest">{news.date}</span>
                                    <span className="px-3 py-1 rounded-full bg-brushed-gold/5 text-[9px] font-bold text-brushed-gold uppercase tracking-widest border border-brushed-gold/10">
                                        {news.tag}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-serif text-midnight-navy mb-6 group-hover:text-brushed-gold transition-colors">{news.title}</h3>
                                <p className="text-sm text-midnight-navy/60 font-light leading-relaxed mb-8">{news.summary}</p>

                                <div className="mt-auto p-5 bg-[#FBFBFB] rounded-xl border-l-4 border-brushed-gold">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-2 font-sans">B2B Takeaway</p>
                                    <p className="text-xs text-midnight-navy/80 italic font-medium leading-relaxed">"{news.takeaway}"</p>
                                </div>
                            </div>
                            <div className="md:w-16 bg-midnight-navy flex md:flex-col items-center justify-center p-4 gap-4">
                                <a href={news.url} target="_blank" className="text-white hover:text-brushed-gold transition-colors">
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}

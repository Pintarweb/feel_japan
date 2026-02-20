import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Newspaper, ArrowRight, ExternalLink, ShieldCheck, Zap, Heart, Compass, PlayCircle } from "lucide-react";
import WeatherWidget from "@/components/shared/WeatherWidget";
import CurrencyWidget from "@/components/shared/CurrencyWidget";

const B2B_INSIDER_ALERTS = [
    {
        category: "Official Regulatory Alert",
        icon: <Zap className="w-5 h-5 text-amber-500" />,
        title: "Kyoto Lodging Tax Update",
        action: "Action Required: Update Your Kyoto Quotations for 2026",
        summary: "New tiered lodging tax structures coming into effect for premium properties.",
        url: "#"
    },
    {
        category: "Muslim-Friendly Spotlight",
        icon: <Heart className="w-5 h-5 text-emerald-500" />,
        title: "New Prayer Facilities in Ginza",
        action: "New Muslim-Friendly Resource for Your VIP Clients",
        summary: "Premium Ginza shopping district has opened a central prayer lounge for international travelers.",
        url: "#"
    },
    {
        category: "Seasonal Logistics",
        icon: <Compass className="w-5 h-5 text-blue-500" />,
        title: "2026 Sakura Forecast & Logistics",
        action: "Action Required: Pre-book Private Coaches by October",
        summary: "Early data suggests 15% increase in domestic travel volume during the 2026 Sakura season.",
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
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none grayscale invert">
                    <Image src="/b2b_collection_banner.png" alt="" fill className="object-cover" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-white/10"></div>
                        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-brushed-gold">Fast-Scan Dashboard</h2>
                        <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {B2B_INSIDER_ALERTS.map((alert, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-500 group">
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
                                <p className="text-xs text-white/60 leading-relaxed">{alert.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
                            {/* Ops Status Card */}
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
                                <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-midnight-navy group-hover:shadow-2xl transition-all duration-500">
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
                                <button className="w-full py-4 bg-midnight-navy text-white text-xs font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-brushed-gold hover:text-midnight-navy transition-all duration-300">
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

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { Newspaper, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import WeatherWidget from "@/components/shared/WeatherWidget";
import CurrencyWidget from "@/components/shared/CurrencyWidget";

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
    },
    {
        date: "March 17, 2025",
        title: "Transition to Calendar Year Data Tracking",
        summary: "JNTO has adjusted data compilation to follow the calendar year (Jan-Dec) instead of the Japanese fiscal year.",
        takeaway: "Ensures more consistent referencing for Malaysian partners. Expect more streamlined data reports moving forward.",
        url: "https://res.cloudinary.com/jnto/image/upload/v1/media/filer_public/1e/aa/1eaa66ae-e394-4342-8cb7-61d624e1624f/malaysian_incentive_travel_trends_2024_znhovm",
        tag: "Operational Update"
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

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brushed-gold/5 border border-brushed-gold/10 mb-8 cursor-default">
                            <Newspaper className="w-4 h-4 text-brushed-gold" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brushed-gold">
                                Strategic Intelligence
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif text-midnight-navy mb-8 leading-tight">
                            B2B Travel <span className="italic font-light text-brushed-gold">Bulletin</span>
                        </h1>
                        <p className="text-lg md:text-xl text-midnight-navy/60 font-light leading-relaxed">
                            The bridge between ground-level reality in Tokyo and your B2B operations in Malaysia. Curated news, market intelligence, and live conditions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Live Widgets Section */}
            <section className="py-12 bg-[#F8F8F8]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <WeatherWidget />
                        <CurrencyWidget />
                        <div className="bg-midnight-navy p-8 rounded-sm shadow-xl flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brushed-gold/5 -mr-16 -mt-16 rounded-full group-hover:bg-brushed-gold/10 transition-all duration-700"></div>
                            <ShieldCheck className="w-8 h-8 text-brushed-gold mb-4" />
                            <h3 className="text-white text-lg font-serif mb-2">Ground Status: Green</h3>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed">
                                Our Tokyo operations center reports normal conditions across all major itineraries.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Updates List */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-16">
                    <h2 className="text-2xl font-serif text-midnight-navy">Market Intelligence Reports</h2>
                    <div className="h-px flex-1 bg-midnight-navy/5 mx-8 hidden md:block"></div>
                    <p className="text-[10px] font-bold text-brushed-gold uppercase tracking-[0.2em]">Latest Updates First</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {NEWS_UPDATES.map((news, i) => (
                        <article
                            key={i}
                            className="group flex flex-col bg-white p-10 rounded-sm border border-midnight-navy/5 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <span className="text-[10px] font-bold text-brushed-gold/60 uppercase tracking-widest">{news.date}</span>
                                <span className="px-3 py-1 rounded-full bg-brushed-gold/5 text-[9px] font-bold text-brushed-gold uppercase tracking-widest border border-brushed-gold/10">
                                    {news.tag}
                                </span>
                            </div>

                            <h3 className="text-2xl font-serif text-midnight-navy mb-6 group-hover:text-brushed-gold transition-colors leading-snug">
                                {news.title}
                            </h3>

                            <p className="text-base text-midnight-navy/60 font-light leading-relaxed mb-10">
                                {news.summary}
                            </p>

                            <div className="mt-auto pt-8 border-t border-midnight-navy/5">
                                <div className="p-4 bg-off-white/50 rounded-sm mb-8 border-l-2 border-brushed-gold">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-2">B2B Strategy Takeaway</p>
                                    <p className="text-sm text-midnight-navy/80 italic font-medium leading-relaxed">
                                        "{news.takeaway}"
                                    </p>
                                </div>

                                <a
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-midnight-navy hover:text-brushed-gold transition-colors group/link"
                                >
                                    Access Full Resource
                                    <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
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

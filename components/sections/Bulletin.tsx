
import { Newspaper, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

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

export default function Bulletin() {
    return (
        <section className="py-24 bg-white border-y border-midnight-navy/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brushed-gold/10 border border-brushed-gold/20">
                            <Newspaper className="w-3.5 h-3.5 text-brushed-gold" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brushed-gold">Travel Bulletin</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-midnight-navy">
                            Latest from <span className="italic">JNTO Malaysia</span>
                        </h2>
                        <p className="text-midnight-navy/60 font-light max-w-xl">
                            Curated travel trade news and strategic insights to help your agency stay ahead in the Japan tourism market.
                        </p>
                    </div>
                    <Link
                        href="/bulletin"
                        className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-midnight-navy hover:text-brushed-gold transition-colors"
                    >
                        View All Updates
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {NEWS_UPDATES.map((news, i) => (
                        <article
                            key={i}
                            className="group flex flex-col bg-off-white p-8 rounded-sm border border-midnight-navy/5 hover:border-brushed-gold/30 hover:shadow-2xl hover:shadow-brushed-gold/5 transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-bold text-brushed-gold/60 uppercase tracking-widest">{news.date}</span>
                                <span className="px-2 py-0.5 rounded-full bg-white text-[8px] font-bold text-midnight-navy/40 uppercase tracking-tighter border border-midnight-navy/5">
                                    {news.tag}
                                </span>
                            </div>

                            <h3 className="text-xl font-serif text-midnight-navy mb-4 group-hover:text-brushed-gold transition-colors leading-snug">
                                {news.title}
                            </h3>

                            <p className="text-sm text-midnight-navy/60 font-light leading-relaxed mb-6">
                                {news.summary}
                            </p>

                            <div className="mt-auto pt-6 border-t border-midnight-navy/5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-3">B2B Takeaway</p>
                                <p className="text-xs text-midnight-navy/80 italic font-medium leading-relaxed mb-6">
                                    "{news.takeaway}"
                                </p>

                                <a
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brushed-gold group-hover:translate-x-1 transition-transform"
                                >
                                    Read Full Report
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

const GUEST_MOMENTS = [
    {
        image: "/reviews/kyoto_07.jpg",
        caption: "A spiritual walk through the Senbon Torii gates at Fushimi Inari, Kyoto.",
        location: "Kyoto",
        tag: "Cultural Experience"
    },
    {
        image: "/reviews/enjoy_halal_meal_01.jpg",
        caption: "Authentic Halal dining experiences, curated for our guests in Osaka.",
        location: "Osaka",
        tag: "Halal Dining"
    },
    {
        image: "/reviews/fuji_area_01.jpg",
        caption: "Witnessing the majesty of Mt. Fuji at the Fujiten Snow Resort.",
        location: "Fuji Area",
        tag: "Nature"
    },
    {
        image: "/reviews/shirakawago_01.jpg",
        caption: "The winter wonderland of Shirakawago, a UNESCO World Heritage site.",
        location: "Shirakawago",
        tag: "Seasonal"
    },
    {
        image: "/reviews/tokyo_02.jpg",
        caption: "Exploring the historic Kaminarimon Gate in Asakusa, Tokyo.",
        location: "Tokyo",
        tag: "Heritage"
    },
    {
        image: "/reviews/kyoto_01.jpg",
        caption: "The golden reflection of Kinkaku-ji Temple under the Kyoto sky.",
        location: "Kyoto",
        tag: "Architecture"
    },
    {
        image: "/reviews/kyoto_08.jpg",
        caption: "Capturing timeless memories in traditional Kimono at Fushimi Inari.",
        location: "Kyoto",
        tag: "Tradition"
    },
    {
        image: "/reviews/enjoy_halal_meal_02.jpg",
        caption: "Diverse global flavors made Halal-friendly at Tokyo's Manhattan Fish Market.",
        location: "Tokyo",
        tag: "Halal Dining"
    },
    {
        image: "/reviews/fuji_area_02.jpg",
        caption: "A serene cruise across Lake Ashi with views of the mountain peaks.",
        location: "Hakone",
        tag: "Scenic"
    },
    {
        image: "/reviews/shinkansen_01.jpg",
        caption: "Speeding across Japan in comfort - the Shinkansen Bullet Train experience.",
        location: "Shin-Osaka",
        tag: "Logistics"
    },
    {
        image: "/reviews/osaka_03.jpg",
        caption: "The grandeur of Osaka Castle, a testament to Japan's samurai history.",
        location: "Osaka",
        tag: "History"
    },
    {
        image: "/reviews/yukata_01.jpg",
        caption: "Guests embracing Japanese culture with our curated Yukata workshops.",
        location: "Japan",
        tag: "Cultural"
    },
    {
        image: "/reviews/tokyo_01.jpg",
        caption: "Family adventures at the iconic Kaminarimon in the heart of Asakusa.",
        location: "Tokyo",
        tag: "Family B2B"
    },
    {
        image: "/reviews/shirakawago_02.jpg",
        caption: "The fairytale Gites-style houses of Shirakawago during the snow season.",
        location: "Gifu",
        tag: "Adventure"
    },
    {
        image: "/reviews/fuji_area_05.jpg",
        caption: "Family moments at the 5th Station of Mt. Fuji, 2,300 meters above sea level.",
        location: "Mt. Fuji",
        tag: "Milestone"
    },
    {
        image: "/reviews/kyoto_03.jpg",
        caption: "Lost in the emerald world of the Arashiyama Bamboo Grove.",
        location: "Kyoto",
        tag: "Nature"
    },
    {
        image: "/reviews/kobe_03.jpg",
        caption: "Visiting the beautiful Kobe Mosque, a cornerstone of Japanese-Muslim history.",
        location: "Kobe",
        tag: "Islamic Heritage"
    },
    {
        image: "/reviews/tokyo_04.jpg",
        caption: "The tranquil forest path leading to the Meiji Shrine in Shibuya.",
        location: "Tokyo",
        tag: "Spiritual"
    }
];

export default function ReviewsPage() {
    return (
        <main className="relative min-h-screen bg-off-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-midnight-navy">
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                <Image
                    src="/reviews/kyoto_07.jpg"
                    alt="Japan Gallery"
                    fill
                    className="object-cover object-center opacity-40 grayscale-[20%]"
                />
                <div className="relative z-20 text-center max-w-4xl px-6">
                    <span className="text-brushed-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block animate-fade-in-up uppercase">Guest Stories</span>
                    <h1 className="text-5xl md:text-7xl font-serif text-white font-medium mb-6 leading-tight animate-fade-in-up delay-100 italic">
                        The Global <br /> <span className="text-white/90 underline decoration-brushed-gold/30 underline-offset-8">Guest Anthology</span>
                    </h1>
                    <p className="text-white/85 text-sm md:text-base font-light tracking-widest uppercase max-w-xl mx-auto animate-fade-in-up delay-200">
                        Bridging continents and cultures through impeccably curated Japanese experiences.
                    </p>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy mb-4">A Portfolio of Inspired Travels</h2>
                    <div className="w-12 h-1 bg-brushed-gold mx-auto mb-6"></div>
                    <p className="text-midnight-navy/85 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Every image is a testament to our local expertise. From the prayer-friendly routes of Kyoto to the Halal delicacies of Osaka, we bring the best of Japan to your itinerary
                    </p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {GUEST_MOMENTS.map((moment, index) => (
                        <div key={index} className="break-inside-avoid group relative overflow-hidden rounded-[2.5rem] bg-midnight-navy shadow-sm transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                            <div className="relative aspect-[4/5] md:aspect-auto overflow-hidden">
                                <Image
                                    src={moment.image}
                                    alt={moment.caption}
                                    width={800}
                                    height={1000}
                                    className="object-cover w-full h-auto transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy via-midnight-navy/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-brushed-gold text-[9px] font-bold text-white uppercase tracking-widest rounded-lg">
                                        {moment.tag}
                                    </span>
                                    <span className="text-white/85 text-[10px] uppercase font-bold tracking-[0.2em] flex items-center gap-1">
                                        <svg className="w-3 h-3 text-brushed-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {moment.location}
                                    </span>
                                </div>
                                <p className="text-white font-serif text-lg leading-snug font-medium italic">
                                    "{moment.caption}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action */}
                <div className="mt-32 p-16 rounded-[4rem] bg-off-white border border-midnight-navy/5 text-center relative overflow-hidden shadow-inner">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-brushed-gold/5 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-5xl font-serif text-midnight-navy mb-6">Join Our <span className="italic text-brushed-gold">Partner Network</span></h3>
                        <p className="text-midnight-navy/85 mb-10 max-w-xl mx-auto text-lg font-light">
                            Become a part of the anthology. We provide the expertise, you provide the guests—together we create Japan's finest Muslim-friendly journeys.
                        </p>
                        <a href="/agent/signup" className="inline-block bg-midnight-navy text-white px-12 py-5 rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-2xl hover:bg-brushed-gold transition-all duration-500">
                            Apply for Partnership
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

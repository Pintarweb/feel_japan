import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
    return (
        <main className="relative min-h-screen bg-off-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-midnight-navy">
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                <div className="relative z-20 text-center max-w-4xl px-6">
                    <span className="text-brushed-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block animate-fade-in-up">Our Philosophy</span>
                    <h1 className="text-5xl md:text-7xl font-serif text-white font-medium mb-8 leading-tight animate-fade-in-up delay-100">
                        Bridging Cultures <br /> Through <span className="italic text-white/90">Curated Journeys</span>
                    </h1>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-serif text-midnight-navy">The Art of Japanese Hospitality</h2>
                        <div className="w-20 h-1 bg-brushed-gold"></div>
                        <p className="text-midnight-navy/80 leading-relaxed font-light text-lg">
                            Feel Japan with K was founded on a simple yet profound premise: to showcase the authentic beauty of Japan while ensuring uncompromising comfort for our Muslim guests. We believe that spiritual needs should never limit the depth of cultural exploration.
                        </p>
                        <p className="text-midnight-navy/80 leading-relaxed font-light text-lg">
                            Our team of local experts and travel designers craft itineraries that go beyond the guidebooks, opening doors to private experiences, halal-certified culinary gems, and moments of genuine connection.
                        </p>
                    </div>
                    <div className="relative h-[600px] w-full bg-gray-200 rounded-[2rem] overflow-hidden shadow-2xl">
                        {/* Placeholder for About Us Image */}
                        <div className="absolute inset-0 flex items-center justify-center text-midnight-navy/20 font-serif italic text-2xl">
                            Brand Imagery
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

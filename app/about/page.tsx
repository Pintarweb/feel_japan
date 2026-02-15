import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="relative min-h-screen bg-off-white text-midnight-navy">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-midnight-navy"></div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
                    <span className="text-brushed-gold text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Our Story
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 font-medium tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                        Pioneering <span className="italic font-light">Halal Tourism</span> in Japan
                    </h1>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 md:py-32 px-6">
                <div className="max-w-4xl mx-auto space-y-12">

                    <div className="text-center mb-16">
                        <div className="w-px h-24 bg-brushed-gold mx-auto mb-8"></div>
                        <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy italic">
                            Connecting Cultures through curated experiences.
                        </h2>
                    </div>

                    <div className="space-y-8 text-lg font-light leading-relaxed text-midnight-navy/80 text-justify md:text-left">
                        <p>
                            <strong className="font-bold text-midnight-navy">Feel Japan with K Co. Ltd</strong> is a Tokyo based Travel Agency pioneering in offering and managing Muslim Tours packages in Japan.
                        </p>

                        <p>
                            Feel Japan with K Co. Ltd is a licensed Travel Agency in Japan. Our Malaysian partner, <strong className="font-bold text-midnight-navy">Ark Alliance Sdn Bhd</strong>, is located in Kuala Lumpur. Ark Alliance Sdn Bhd is partnering with Malaysian Travel Agencies to promotes and market Japan Halal Muslim Packages.
                        </p>

                        <p>
                            We take great care and pride with high commitment in providing proper Muslim Tours program in Japan.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-16 pt-16 border-t border-midnight-navy/10">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-midnight-navy/5">
                            <h3 className="text-xl font-serif text-midnight-navy mb-4">Tokyo Headquarters</h3>
                            <p className="text-sm text-midnight-navy/60 leading-relaxed">
                                Curating authentic Japanese experiences directly from the heart of Tokyo.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-midnight-navy/5">
                            <h3 className="text-xl font-serif text-midnight-navy mb-4">Kuala Lumpur Partner</h3>
                            <p className="text-sm text-midnight-navy/60 leading-relaxed">
                                Ark Alliance Sdn Bhd facilitates seamless communication and partnerships within Malaysia.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}

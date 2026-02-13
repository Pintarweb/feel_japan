import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BulletinPage() {
    return (
        <main className="relative min-h-screen bg-off-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-midnight-navy">
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                <div className="relative z-20 text-center max-w-4xl px-6">
                    <span className="text-brushed-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block animate-fade-in-up">Latest Insights</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white font-medium mb-8 leading-tight animate-fade-in-up delay-100">
                        Travel Bulletin & Updates
                    </h1>
                </div>
            </section>

            {/* List Section */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-midnight-navy/85 uppercase text-xs font-bold tracking-widest">Stay Informed</p>
                    <h2 className="text-3xl font-serif text-midnight-navy mt-4">Seasonal Updates & Advisories</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Placeholder Card 1 */}
                    <div className="bg-white overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-midnight-navy/5">
                        <div className="bg-gray-100 h-64 flex items-center justify-center text-midnight-navy/20 font-serif">Featured</div>
                        <div className="p-8">
                            <span className="text-[10px] font-bold uppercase text-brushed-gold tracking-widest block mb-2">Winter 2026</span>
                            <h3 className="text-xl font-bold font-serif text-midnight-navy mb-3">Hokkaido Snow Festival Availability</h3>
                            <p className="text-sm text-midnight-navy/85 leading-relaxed line-clamp-3">
                                Ensuring early access to premium ryokans during the Sapporo Snow Festival. Booking windows are now open for FIT and small groups.
                            </p>
                            <button className="mt-6 text-xs font-bold uppercase tracking-widest text-midnight-navy border-b border-brushed-gold pb-1 hover:text-brushed-gold transition-colors">Read More</button>
                        </div>
                    </div>

                    {/* Placeholder Card 2 */}
                    <div className="bg-white overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-midnight-navy/5">
                        <div className="bg-gray-100 h-64 flex items-center justify-center text-midnight-navy/20 font-serif">Update</div>
                        <div className="p-8">
                            <span className="text-[10px] font-bold uppercase text-brushed-gold tracking-widest block mb-2">Advisory</span>
                            <h3 className="text-xl font-bold font-serif text-midnight-navy mb-3">Spring Sakura Forecast</h3>
                            <p className="text-sm text-midnight-navy/85 leading-relaxed line-clamp-3">
                                Preliminary forecasts suggest an early bloom for Tokyo and Kyoto regions. We advise adjusting itineraries for late March arrivals.
                            </p>
                            <button className="mt-6 text-xs font-bold uppercase tracking-widest text-midnight-navy border-b border-brushed-gold pb-1 hover:text-brushed-gold transition-colors">Read More</button>
                        </div>
                    </div>

                    {/* Placeholder Card 3 */}
                    <div className="bg-white overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-midnight-navy/5">
                        <div className="bg-gray-100 h-64 flex items-center justify-center text-midnight-navy/20 font-serif">New Opening</div>
                        <div className="p-8">
                            <span className="text-[10px] font-bold uppercase text-brushed-gold tracking-widest block mb-2">Kyoto</span>
                            <h3 className="text-xl font-bold font-serif text-midnight-navy mb-3">Private Villa Collection</h3>
                            <p className="text-sm text-midnight-navy/85 leading-relaxed line-clamp-3">
                                We are proud to announce the addition of three exclusive machiya townhouses to our portfolio, offering complete privacy for families.
                            </p>
                            <button className="mt-6 text-xs font-bold uppercase tracking-widest text-midnight-navy border-b border-brushed-gold pb-1 hover:text-brushed-gold transition-colors">Read More</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

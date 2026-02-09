import { MapPin, Calendar, Check, Utensils, Hotel, Bus, Train, Plane, Star, Camera, Mountain, ShoppingBag, Footprints, Droplet, UserCheck, Map } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// This would eventually be dynamic, but for now we hardcode the FIT Tokyo content
// to replace FITTYOSUMMER26.html
export default function BrochureTemplate() {
    return (
        <main className="bg-white min-h-screen">
            <Navbar hideInquiry={true} />

            {/* Hero Section */}
            <header className="relative h-[60vh] flex flex-col items-center justify-center text-center text-white px-4">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1920"
                        alt="Tokyo Banner"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 animate-fade-in-up">
                    <span className="block text-brushed-gold text-sm font-bold tracking-[0.3em] uppercase mb-4">
                        Summer 2026
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold mb-8 tracking-[0.2em] hero-text-shadow uppercase opacity-95">Summer Discovery</h2>
                    <p className="text-xl md:text-2xl font-light mb-8 opacity-90 hero-text-shadow tracking-widest">5D4N Round FIT Muslim Tour • Summer 2026</p>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <span className="bg-japan-red text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg uppercase tracking-widest">Type 2</span>
                        <span className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold shadow-lg uppercase tracking-widest">2 - 8 Pax Private</span>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-16">

                {/* Itinerary Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-midnight-navy mb-4">The Journey</h2>
                    <div className="h-1 w-20 bg-brushed-gold mx-auto"></div>
                </div>

                <div className="space-y-4">
                    {/* Day 1 */}
                    <div className="flex flex-col md:flex-row gap-8 group p-8 rounded-3xl transition-colors hover:bg-midnight-navy/5">
                        <div className="md:w-32 flex-shrink-0">
                            <div className="sticky top-24">
                                <span className="block text-brushed-gold font-serif text-4xl leading-none mb-2">01</span>
                                <span className="text-xs font-bold text-midnight-navy/40 uppercase tracking-widest">Day</span>
                            </div>
                        </div>
                        <div className="flex-grow border-l border-midnight-navy/10 pl-8 pb-4 relative group-last:border-l-0">
                            {/* Dot */}
                            <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-brushed-gold ring-4 ring-white group-hover:ring-transparent transition-all"></div>

                            <h3 className="text-xl font-bold text-midnight-navy uppercase tracking-wide mb-2">Arrival & Tokyo</h3>
                            <p className="text-xs font-bold text-brushed-gold uppercase tracking-widest mb-6">(Lunch & Dinner Included)</p>

                            <ul className="space-y-4">
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <UserCheck className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Meet and Greet by Tour Guide at Narita Airport lobby</span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <Bus className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Depart for <strong>Tokyo City Tour</strong></span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <MapPin className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Visit <strong>Asakusa Kannon Temple</strong> & <strong>Nakamise Street</strong></span>
                                </li>
                                {/* Added missing items from Day 1 to match full HTML */}
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <Camera className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Photo stop at <strong>Tokyo Skytree</strong> and visit <strong>Asakusa Mosque</strong></span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <ShoppingBag className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Explore <strong>Ueno Ameyoko Street</strong> and <strong>Akihabara</strong> Hobby Town</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Day 2 - Alternate BG */}
                    <div className="flex flex-col md:flex-row gap-8 group bg-midnight-navy/5 p-8 rounded-3xl">
                        <div className="md:w-32 flex-shrink-0">
                            <div className="sticky top-24">
                                <span className="block text-brushed-gold font-serif text-4xl leading-none mb-2">02</span>
                                <span className="text-xs font-bold text-midnight-navy/40 uppercase tracking-widest">Day</span>
                            </div>
                        </div>
                        <div className="flex-grow border-l border-midnight-navy/10 pl-8 pb-4 relative group-last:border-l-0">
                            <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-midnight-navy/20 ring-4 ring-white group-hover:bg-brushed-gold transition-colors"></div>

                            <h3 className="text-xl font-bold text-midnight-navy uppercase tracking-wide mb-2">Mt Fuji & Shinkansen</h3>
                            <p className="text-xs font-bold text-brushed-gold uppercase tracking-widest mb-6">(Breakfast / Lunch / Dinner)</p>

                            <ul className="space-y-4">
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <Bus className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Depart from hotel for <strong>Mount Fuji Excursion</strong></span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <Mountain className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Visit <strong>Mt. Fuji 5th Station</strong> for breathtaking views (weather permitting)</span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <ShoppingBag className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Shopping at <strong>Gotemba Premium Outlet</strong> (Prayer room available)</span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <Train className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span><strong>Shinkansen (Bullet Train)</strong> Experience: Odawara to Tokyo (30 mins)</span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <Footprints className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Group walk back to hotel with guide via local train</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Day 3 */}
                    <div className="flex flex-col md:flex-row gap-8 group p-8 rounded-3xl transition-colors hover:bg-midnight-navy/5">
                        <div className="md:w-32 flex-shrink-0">
                            <div className="sticky top-24">
                                <span className="block text-brushed-gold font-serif text-4xl leading-none mb-2">03</span>
                                <span className="text-xs font-bold text-midnight-navy/40 uppercase tracking-widest">Day</span>
                            </div>
                        </div>
                        <div className="flex-grow border-l border-midnight-navy/10 pl-8 pb-4 relative group-last:border-l-0">
                            <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-midnight-navy/20 ring-4 ring-white group-hover:bg-brushed-gold transition-colors"></div>

                            <h3 className="text-xl font-bold text-midnight-navy uppercase tracking-wide mb-2">Tokyo Modern Life</h3>
                            <p className="text-xs font-bold text-brushed-gold uppercase tracking-widest mb-6">(Breakfast / Lunch)</p>

                            <ul className="space-y-4">
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <ShoppingBag className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Visit <strong>Harajuku (Takeshita Street)</strong> and <strong>Tokyo Mosque</strong></span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <Camera className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Witness the <strong>Shibuya Crossing</strong> & visit <strong>Tsukiji Outer Market</strong></span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <MapPin className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Explore <strong>Odaiba</strong> (Rainbow Bridge & Gundam Statue)</span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/60 leading-relaxed italic">
                                    <Utensils className="w-5 h-5 text-midnight-navy/40 flex-shrink-0" />
                                    <span>Dinner by own pax arrangement</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Day 4 - Alternate BG */}
                    <div className="flex flex-col md:flex-row gap-8 group bg-midnight-navy/5 p-8 rounded-3xl">
                        <div className="md:w-32 flex-shrink-0">
                            <div className="sticky top-24">
                                <span className="block text-brushed-gold font-serif text-4xl leading-none mb-2">04</span>
                                <span className="text-xs font-bold text-midnight-navy/40 uppercase tracking-widest">Day</span>
                            </div>
                        </div>
                        <div className="flex-grow border-l border-midnight-navy/10 pl-8 pb-4 relative group-last:border-l-0">
                            <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-midnight-navy/20 ring-4 ring-white group-hover:bg-brushed-gold transition-colors"></div>

                            <h3 className="text-xl font-bold text-midnight-navy uppercase tracking-wide mb-2">Free & Easy</h3>
                            <p className="text-xs font-bold text-brushed-gold uppercase tracking-widest mb-6">(Breakfast)</p>

                            <p className="text-sm font-semibold text-midnight-navy/60 mb-4 italic">No Van / No Guide support today. Explore at your own leisure:</p>
                            <ul className="space-y-4">
                                <li className="flex gap-4 text-sm text-midnight-navy/80 leading-relaxed">
                                    <Star className="w-5 h-5 text-brushed-gold flex-shrink-0" />
                                    <span>Recommended: Tokyo Disneyland or Disney Sea 1-Day Pass</span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/60 leading-relaxed italic">
                                    <Utensils className="w-5 h-5 text-midnight-navy/40 flex-shrink-0" />
                                    <span>Lunch and Dinner by own pax</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Day 5 */}
                    <div className="flex flex-col md:flex-row gap-8 group p-8 rounded-3xl transition-colors hover:bg-midnight-navy/5">
                        <div className="md:w-32 flex-shrink-0">
                            <div className="sticky top-24">
                                <span className="block text-midnight-navy/40 font-serif text-4xl leading-none mb-2">05</span>
                                <span className="text-xs font-bold text-midnight-navy/40 uppercase tracking-widest">Day</span>
                            </div>
                        </div>
                        <div className="flex-grow border-l-0 pl-8 pb-4 relative">
                            <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-midnight-navy/40 ring-4 ring-white"></div>

                            <h3 className="text-xl font-bold text-midnight-navy/60 uppercase tracking-wide mb-2">Departure</h3>
                            <p className="text-xs font-bold text-midnight-navy/40 uppercase tracking-widest mb-6">(Breakfast)</p>

                            <ul className="space-y-4">
                                <li className="flex gap-4 text-sm text-midnight-navy/60 leading-relaxed">
                                    <Hotel className="w-5 h-5 text-midnight-navy/40 flex-shrink-0" />
                                    <span>Hotel check-out</span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/60 leading-relaxed">
                                    <Bus className="w-5 h-5 text-midnight-navy/40 flex-shrink-0" />
                                    <span>Private transfer to Narita International Airport</span>
                                </li>
                                <li className="flex gap-4 text-sm text-midnight-navy/60 leading-relaxed italic">
                                    <Plane className="w-5 h-5 text-midnight-navy/40 flex-shrink-0" />
                                    <span>Flight back home • End of Service</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Package Pricing Section */}
                <section className="mb-20 mt-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif text-midnight-navy mb-4">Package Pricing</h2>
                        <div className="h-1 w-20 bg-brushed-gold mx-auto mb-4"></div>
                        <p className="text-midnight-navy/60 font-medium italic text-sm">Private FIT Tour • Summer 2026 Rates (JPY)</p>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-midnight-navy/5">
                        <table className="w-full text-left">
                            <thead className="bg-midnight-navy/5 border-b border-midnight-navy/10">
                                <tr>
                                    <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Pax Count</th>
                                    <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Adult</th>
                                    <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Child (CWB)</th>
                                    <th className="px-8 py-6 font-bold uppercase text-midnight-navy text-xs tracking-widest">Child (CNB)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-midnight-navy/5 font-medium text-sm text-midnight-navy/80">
                                <tr><td className="px-8 py-5">2 Pax</td><td className="px-8 py-5 text-brushed-gold font-bold">371,200</td><td className="px-8 py-5">368,450</td><td className="px-8 py-5 opacity-40">--</td></tr>
                                <tr><td className="px-8 py-5">3 Pax</td><td className="px-8 py-5 text-brushed-gold font-bold">278,750</td><td className="px-8 py-5">276,000</td><td className="px-8 py-5 opacity-40">226,300</td></tr>
                                <tr><td className="px-8 py-5">4 Pax</td><td className="px-8 py-5 text-brushed-gold font-bold">231,800</td><td className="px-8 py-5">229,100</td><td className="px-8 py-5 opacity-40">179,400</td></tr>
                                <tr><td className="px-8 py-5">5 Pax</td><td className="px-8 py-5 text-brushed-gold font-bold">204,200</td><td className="px-8 py-5">201,500</td><td className="px-8 py-5 opacity-40">164,250</td></tr>
                                <tr><td className="px-8 py-5">6 Pax</td><td className="px-8 py-5 text-brushed-gold font-bold">184,900</td><td className="px-8 py-5">182,150</td><td className="px-8 py-5 opacity-40">132,500</td></tr>
                                <tr><td className="px-8 py-5">7 Pax</td><td className="px-8 py-5 text-brushed-gold font-bold">172,500</td><td className="px-8 py-5">169,750</td><td className="px-8 py-5 opacity-40">120,050</td></tr>
                                <tr><td className="px-8 py-5">8 Pax</td><td className="px-8 py-5 text-brushed-gold font-bold">162,850</td><td className="px-8 py-5">160,100</td><td className="px-8 py-5 opacity-40">110,400</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="text-center text-[10px] text-midnight-navy/40 mt-4 font-bold uppercase tracking-widest italic">*Weekend/Holiday Surcharge: 2,000 YEN / Pax / Night applies.</p>
                </section>

                {/* Inclusions & Exclusions */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* Inclusions */}
                    <div className="bg-white p-10 rounded-lg shadow-lg border-l-4 border-brushed-gold flex flex-col">
                        <h3 className="text-2xl font-serif text-midnight-navy mb-8 flex items-center gap-3">
                            <Check className="text-brushed-gold" /> What's Included
                        </h3>
                        <ul className="space-y-4 text-sm font-medium text-midnight-navy/70 leading-relaxed">
                            <li className="flex gap-4"><Hotel className="w-5 h-5 flex-shrink-0 text-brushed-gold" /> <span>4 Nights Stay: <strong>Shinjuku Washington Hotel</strong> or similar with daily Breakfast</span></li>
                            <li className="flex gap-4"><Utensils className="w-5 h-5 flex-shrink-0 text-brushed-gold" /> <span>Lunch and Dinner as per Itinerary (Halal/Muslim-friendly focus)</span></li>
                            <li className="flex gap-4"><Bus className="w-5 h-5 flex-shrink-0 text-brushed-gold" /> <span>Private Transportation throughout the tour (Except Day 4)</span></li>
                            <li className="flex gap-4"><Train className="w-5 h-5 flex-shrink-0 text-brushed-gold" /> <span>Shinkansen Experience (Odawara to Tokyo - Free Seat)</span></li>
                            <li className="flex gap-4"><UserCheck className="w-5 h-5 flex-shrink-0 text-brushed-gold" /> <span>Professional English/Malay/Indonesian speaking guide</span></li>
                            <li className="flex gap-4"><Droplet className="w-5 h-5 flex-shrink-0 text-brushed-gold" /> <span>1 Bottle of Mineral Water per pax per day</span></li>
                        </ul>
                    </div>

                    {/* Exclusions */}
                    <div className="bg-midnight-navy text-white p-10 rounded-lg shadow-2xl flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <div className="w-64 h-64 border-8 border-white rounded-full"></div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mb-6 flex items-center gap-3">
                                What's Excluded
                            </h3>
                            <ul className="space-y-3 text-xs font-bold text-white/60 italic mb-8">
                                <li>• Weekend & Holiday Surcharge: 2,000 Yen / Pax / Night</li>
                                <li>• Tipping for Guide & Driver: 1,000 Yen / Pax / Day (Total 5,000 Yen)</li>
                                <li>• International Flight Tickets & Insurance</li>
                                <li>• Travel Insurance & Personal Expenses</li>
                            </ul>

                            <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-brushed-gold border-t border-white/10 pt-6 uppercase tracking-tight">
                                Optional: Tokyo Disney Resort
                            </h3>
                            <div className="bg-white/5 p-4 rounded-md mb-8">
                                <p className="text-[11px] font-bold text-white mb-2 uppercase tracking-widest">1-Day Free Ride Pass:</p>
                                <ul className="text-[10px] space-y-1 font-semibold text-white/50">
                                    <li>• Adult: 7,900 ~ 10,900 YEN</li>
                                    <li>• Junior (12-17yrs): 6,600 ~ 9,000 YEN</li>
                                    <li>• Child (4~11yrs): 4,700 ~ 5,600 YEN</li>
                                </ul>
                            </div>

                            <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-brushed-gold border-t border-white/10 pt-6 uppercase tracking-tight">
                                Payment Terms
                            </h3>
                            <div className="space-y-4 text-xs font-semibold opacity-90 leading-relaxed">
                                <div>
                                    <p className="text-brushed-gold uppercase font-black mb-1">Deposit (Non-Refundable)</p>
                                    <p>30% of total amount required within one week after confirmation.</p>
                                </div>
                                <div>
                                    <p className="text-brushed-gold uppercase font-black mb-1">Final Payment (70%)</p>
                                    <p>Required in full 1 week before departure for FIT groups.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Inquiry CTA */}
            <a
                href="/inquire?package=5D4N%20Tokyo%20Mt%20Fuji%20Summer%20Discovery"
                className="fixed bottom-52 right-8 z-50 inline-flex items-center gap-3 bg-brushed-gold text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-midnight-navy transition-colors shadow-2xl hover:shadow-brushed-gold/20 transform hover:-translate-y-1 border-2 border-white/10"
            >
                <MapPin className="w-4 h-4" />
                <span>Request Quote</span>
            </a>

            <Footer />
        </main >
    );
}

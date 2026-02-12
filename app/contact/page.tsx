import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="relative min-h-screen bg-off-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-midnight-navy">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <div className="relative z-20 text-center max-w-4xl px-6">
                    <span className="text-brushed-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block animate-fade-in-up">Start the Conversation</span>
                    <h1 className="text-5xl md:text-7xl font-serif text-white font-medium mb-8 leading-tight animate-fade-in-up delay-100">
                        Connect With Our <br /> <span className="italic text-white/90">Travel Designers</span>
                    </h1>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-4xl font-serif text-midnight-navy mb-2">Office Headquarters</h2>
                            <p className="text-midnight-navy/60 leading-relaxed max-w-md">Our concierge team is available Monday to Friday, 9:00 AM to 6:00 PM (JST).</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-full bg-midnight-navy/5 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-midnight-navy" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-midnight-navy mb-1">Visit Us</h3>
                                    <p className="text-midnight-navy/80 font-serif text-lg leading-relaxed">
                                        Level 35, Marunouchi Building<br />
                                        2-4-1 Marunouchi, Chiyoda-ku<br />
                                        Tokyo 100-6335, Japan
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-full bg-midnight-navy/5 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-midnight-navy" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-midnight-navy mb-1">New Inquiries</h3>
                                    <p className="text-midnight-navy/80 font-serif text-lg leading-relaxed">+81 3-1234-5678</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-full bg-midnight-navy/5 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-midnight-navy" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-midnight-navy mb-1">Email Concierge</h3>
                                    <p className="text-midnight-navy/80 font-serif text-lg leading-relaxed">concierge@feeljapan.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-2xl border border-midnight-navy/5 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brushed-gold/10 rounded-bl-[10rem] -z-0"></div>
                        <h3 className="text-2xl font-serif font-bold text-midnight-navy mb-8 relative z-10">Send us a message</h3>
                        <form className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-midnight-navy/60 mb-2">Full Name</label>
                                <input type="text" className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3 text-midnight-navy focus:ring-2 focus:ring-brushed-gold/20 outline-none transition-all" placeholder="Enter your name" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-midnight-navy/60 mb-2">Email Address</label>
                                <input type="email" className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3 text-midnight-navy focus:ring-2 focus:ring-brushed-gold/20 outline-none transition-all" placeholder="Enter your email" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-midnight-navy/60 mb-2">Message</label>
                                <textarea className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3 text-midnight-navy focus:ring-2 focus:ring-brushed-gold/20 outline-none transition-all h-32 resize-none" placeholder="How can we assist you?"></textarea>
                            </div>
                            <button className="w-full bg-midnight-navy text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-midnight-navy/90 transition-all shadow-xl shadow-midnight-navy/20">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Download, Globe, ArrowRight, MessageSquare, Building2, Briefcase } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <main className="relative min-h-screen bg-off-white text-midnight-navy selection:bg-brushed-gold/20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 bg-white border-b border-midnight-navy/5 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <Image
                        src="/b2b_collection_banner.png"
                        alt="Background Pattern"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brushed-gold/5 border border-brushed-gold/10 mb-8 animate-fade-in group cursor-default">
                        <MessageSquare className="w-4 h-4 text-brushed-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brushed-gold">
                            Partner Support Center
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-midnight-navy mb-8 leading-tight">
                        Contact Us: <br />
                        <span className="italic font-light text-brushed-gold">Your Local Partner for Japan</span>
                    </h1>
                    <p className="text-midnight-navy/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        We are here to help your travel agency grow. Whether you need a custom group quotation, access to our 2026 brochures, or technical support, our team in Malaysia and Japan is ready to assist.
                    </p>
                </div>
            </section>

            {/* The Bridge to Japan Visual Section */}
            <section className="py-20 bg-[#F8F8F8] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative h-64 md:h-80 flex items-center justify-between px-10 md:px-40">
                        {/* Connecting Line (Arc) */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full pointer-events-none opacity-20 hidden md:block">
                            <svg viewBox="0 0 800 200" className="w-full h-full">
                                <path
                                    d="M 100 150 Q 400 20 700 150"
                                    fill="none"
                                    stroke="url(#goldGradient)"
                                    strokeWidth="2"
                                    strokeDasharray="8 8"
                                    className="animate-[dash_30s_linear_infinite]"
                                />
                                <defs>
                                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#C5A059" />
                                        <stop offset="100%" stopColor="#C5A059" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        {/* Malaysia Point */}
                        <div className="relative z-10 flex flex-col items-center gap-4 group">
                            <div className="w-20 h-20 rounded-full bg-white border border-midnight-navy/5 shadow-xl flex items-center justify-center group-hover:border-brushed-gold/30 transition-all duration-500 scale-110">
                                <span className="text-3xl">🇲🇾</span>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-brushed-gold uppercase tracking-[0.3em]">Kuala Lumpur</p>
                                <p className="text-xs text-midnight-navy/40 font-light mt-1 uppercase tracking-widest leading-none">Primary Support</p>
                            </div>
                        </div>

                        {/* Bridge Concept Text (Mobile Only hidden usually but we keep it small) */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="w-16 h-16 rounded-full border border-brushed-gold/10 flex items-center justify-center">
                                <Globe className="w-6 h-6 text-brushed-gold opacity-20" />
                            </div>
                            <p className="text-[10px] font-bold text-brushed-gold/30 uppercase tracking-[0.5em] mt-2 whitespace-nowrap">Direct Bridge</p>
                        </div>

                        {/* Japan Point */}
                        <div className="relative z-10 flex flex-col items-center gap-4 group">
                            <div className="w-20 h-20 rounded-full bg-white border border-midnight-navy/5 shadow-xl flex items-center justify-center group-hover:border-brushed-gold/30 transition-all duration-500 scale-110">
                                <span className="text-3xl">🇯🇵</span>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-brushed-gold uppercase tracking-[0.3em]">Tokyo HQ</p>
                                <p className="text-xs text-midnight-navy/40 font-light mt-1 uppercase tracking-widest leading-none">Ground Operations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Details Cards */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Malaysia Office */}
                    <article className="bg-white p-10 md:p-12 shadow-sm border border-midnight-navy/5 hover:shadow-2xl transition-all duration-700 rounded-sm group">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-brushed-gold/5 flex items-center justify-center rounded-sm group-hover:bg-brushed-gold transition-colors duration-500">
                                <Building2 className="w-6 h-6 text-brushed-gold group-hover:text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif text-midnight-navy">Malaysia Office</h2>
                                <p className="text-[9px] font-bold text-brushed-gold uppercase tracking-[0.3em]">B2B Relations & Sales</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <h3 className="text-lg font-serif text-midnight-navy mb-3">Ark Alliance Sdn Bhd</h3>
                                <p className="text-sm text-midnight-navy/60 font-light leading-relaxed">
                                    Your primary point of contact for partnership inquiries, marketing resources, and local support.
                                </p>
                            </div>

                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <MapPin className="w-4 h-4 text-brushed-gold shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1 leading-none">Location</p>
                                        <p className="text-sm text-midnight-navy/80">Kuala Lumpur, Malaysia</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Clock className="w-4 h-4 text-brushed-gold shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1 leading-none">Business Hours</p>
                                        <p className="text-sm text-midnight-navy/80">9:00 AM – 6:00 PM (MYT)</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Phone className="w-4 h-4 text-brushed-gold shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1 leading-none">Phone / WhatsApp</p>
                                        <a href="https://wa.me/60137023981" className="text-sm text-midnight-navy hover:text-brushed-gold transition-colors">+60 13-702 3981</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Mail className="w-4 h-4 text-brushed-gold shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1 leading-none">Email</p>
                                        <a href="mailto:admin@feeljapanwithk.com" className="text-sm text-midnight-navy hover:text-brushed-gold transition-colors">admin@feeljapanwithk.com</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </article>

                    {/* Japan Office */}
                    <article className="bg-[#FBFBFB] p-10 md:p-12 shadow-sm border border-midnight-navy/5 hover:shadow-2xl transition-all duration-700 rounded-sm group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Globe className="w-32 h-32 text-midnight-navy" />
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-midnight-navy/5 flex items-center justify-center rounded-sm group-hover:bg-midnight-navy transition-colors duration-500">
                                <ShieldCheck className="w-6 h-6 text-midnight-navy group-hover:text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif text-midnight-navy">Japan Office</h2>
                                <p className="text-[9px] font-bold text-midnight-navy/40 uppercase tracking-[0.3em]">Operations & Ground Support</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <h3 className="text-lg font-serif text-midnight-navy mb-3">Feel Japan with K Co. Ltd</h3>
                                <p className="text-sm text-midnight-navy/60 font-light leading-relaxed italic">
                                    A licensed Japanese Travel Agency providing real-time ground coordination and tour management.
                                </p>
                            </div>

                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <MapPin className="w-4 h-4 text-midnight-navy/30 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1 leading-none">Location</p>
                                        <p className="text-sm text-midnight-navy/80">Tokyo, Japan</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Globe className="w-4 h-4 text-midnight-navy/30 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1 leading-none">Licensing</p>
                                        <p className="text-sm text-midnight-navy/80 uppercase tracking-wider">Licensed Travel Agency (TOKYO No.3-6242)</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Briefcase className="w-4 h-4 text-midnight-navy/30 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1 leading-none">Ground Management</p>
                                        <p className="text-sm text-midnight-navy/80 italic text-justify md:text-left">Dedicated support for groups in Japan</p>
                                    </div>
                                </li>
                            </ul>

                            <div className="pt-8 border-t border-midnight-navy/5">
                                <div className="p-4 bg-white/50 border border-midnight-navy/5 rounded-sm">
                                    <p className="text-[10px] text-midnight-navy/40 font-light leading-relaxed">
                                        For emergency ground support of active tours, please utilize the specific contact lines provided in your agent coordination package.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {/* Quick Resources Section */}
            <section className="py-24 bg-midnight-navy relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-2xl md:text-3xl font-serif text-white mb-6">Quick Resources for Partners</h2>
                    <p className="text-white/50 font-light mb-12 text-sm max-w-xl mx-auto">
                        Don't want to wait for a representative? Get started immediately with our latest self-service tools.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link
                            href="/partner-resources"
                            className="inline-flex items-center gap-4 bg-white text-midnight-navy px-10 py-5 rounded-sm text-xs font-bold uppercase tracking-[0.2em] hover:bg-brushed-gold hover:text-white transition-all duration-500 shadow-2xl group"
                        >
                            <Download className="w-4 h-4" />
                            2026 B2B Brochure
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                        </Link>

                        <Link
                            href="/inquire"
                            className="inline-flex items-center gap-4 border border-white/20 text-white px-10 py-5 rounded-sm text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all duration-500 shadow-2xl"
                        >
                            Submit Custom Quotation Request
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

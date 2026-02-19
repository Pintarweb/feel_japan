import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Download, Globe, ArrowRight, MessageSquare, Building2, Briefcase } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <main className="relative min-h-screen bg-off-white text-midnight-navy selection:bg-brushed-gold/20">
            <Navbar />

            {/* Main Integrated Hero & Bridge Section */}
            <section className="relative pt-32 pb-40 bg-white overflow-hidden">
                {/* Background Pattern - Maximum Visibility */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image
                        src="/b2b_collection_banner.png"
                        alt="Background Pattern"
                        fill
                        className="object-cover opacity-[0.55] brightness-[0.92] scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/30 to-white/90"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Badge */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brushed-gold/5 border border-brushed-gold/10 animate-fade-in group cursor-default">
                            <MessageSquare className="w-4 h-4 text-brushed-gold" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brushed-gold">
                                Partner Support Center
                            </span>
                        </div>
                    </div>

                    {/* Central Content Area with Flanking Flags */}
                    <div className="relative flex flex-col items-center">

                        {/* Title Header */}
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-serif text-midnight-navy mb-8 leading-tight">
                                Contact Us: <br />
                                <span className="italic font-light text-brushed-gold">Your Local Partner for Japan</span>
                            </h1>
                            <p className="text-black text-base md:text-lg font-normal leading-relaxed">
                                We are here to help your travel agency grow. Whether you need a custom group quotation, access to our 2026 brochures, or technical support, our team in Malaysia and Japan is ready to assist.
                            </p>
                        </div>

                        {/* Flanking Regional Nodes (Positioned as sketch) */}
                        <div className="w-full relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 mt-8">

                            {/* Malaysia Node (Left) */}
                            <div className="w-full md:w-[32%] bg-white p-8 border border-midnight-navy/5 shadow-2xl rounded-sm transform md:-translate-y-12 hover:-translate-y-14 transition-all duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-8 relative shadow-sm rounded-sm overflow-hidden border border-midnight-navy/5">
                                        <img
                                            src="https://flagcdn.com/my.svg"
                                            alt="Malaysia Flag"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-serif text-midnight-navy">Malaysia Office</h2>
                                        <p className="text-[8px] font-bold text-brushed-gold uppercase tracking-[0.3em]">Ark Alliance Sdn Bhd</p>
                                    </div>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <MapPin className="w-3 h-3 text-brushed-gold shrink-0 mt-1" />
                                        <span className="text-xs text-midnight-navy/70">Kuala Lumpur, Malaysia</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Phone className="w-3 h-3 text-brushed-gold shrink-0 mt-1" />
                                        <a href="https://wa.me/60137023981" className="text-xs text-midnight-navy hover:text-brushed-gold transition-colors">+60 13-702 3981</a>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Mail className="w-3 h-3 text-brushed-gold shrink-0 mt-1" />
                                        <a href="mailto:admin@feeljapanwithk.com" className="text-xs text-midnight-navy hover:text-brushed-gold transition-colors">admin@feeljapanwithk.com</a>
                                    </li>
                                </ul>
                            </div>

                            {/* Central Bridge Hub */}
                            <div className="relative flex flex-col items-center">
                                {/* Visual Bridge Connector */}
                                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none -z-10 opacity-10">
                                    <svg viewBox="0 0 600 300" className="w-full h-full">
                                        <path
                                            d="M 50 150 Q 300 10 550 150"
                                            fill="none"
                                            stroke="#C5A059"
                                            strokeWidth="2"
                                            strokeDasharray="8 8"
                                            className="animate-[dash_40s_linear_infinite]"
                                        />
                                    </svg>
                                </div>

                                <div className="bg-midnight-navy px-12 py-8 rounded-sm shadow-[0_20px_50px_rgba(2,10,30,0.4)] text-center relative z-20 overflow-hidden border border-white/5">
                                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                                        <Globe className="w-full h-full scale-150 rotate-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-serif text-white italic mb-2 tracking-wide">The BRIDGE</h3>
                                    <div className="w-8 h-[1px] bg-brushed-gold mx-auto mb-4"></div>
                                    <p className="text-[9px] font-bold text-brushed-gold uppercase tracking-[0.5em] leading-none">Connecting Continents</p>
                                </div>
                            </div>

                            {/* Japan Node (Right) */}
                            <div className="w-full md:w-[32%] bg-white p-8 border border-midnight-navy/5 shadow-2xl rounded-sm transform md:-translate-y-12 hover:-translate-y-14 transition-all duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-8 relative shadow-sm rounded-sm overflow-hidden border border-midnight-navy/5">
                                        <img
                                            src="https://flagcdn.com/jp.svg"
                                            alt="Japan Flag"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-serif text-midnight-navy">Japan Office</h2>
                                        <p className="text-[8px] font-bold text-midnight-navy/40 uppercase tracking-[0.3em]">Feel Japan with K Co. Ltd</p>
                                    </div>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <ShieldCheck className="w-3 h-3 text-midnight-navy/30 shrink-0 mt-1" />
                                        <span className="text-xs text-midnight-navy/70 font-light">Licensed Agency (No.3-6242)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <MapPin className="w-3 h-3 text-midnight-navy/30 shrink-0 mt-1" />
                                        <span className="text-xs text-midnight-navy/70 font-light">Tokyo, Japan</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Briefcase className="w-3 h-3 text-midnight-navy/30 shrink-0 mt-1" />
                                        <span className="text-xs text-midnight-navy/70 font-light uppercase tracking-tighter">Ground Support Team</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Vertical Divider Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-t from-midnight-navy/10 to-transparent"></div>
            </section>

            {/* Support Strategy Content */}
            <section className="py-24 bg-[#F8F8F8]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="mb-16 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy leading-snug">
                            How We Support Your Agency
                        </h2>
                        <p className="text-black/80 font-normal text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                            Malaysia handles your account management and local support, while our Tokyo headquarters ensures perfect ground execution and real-time coordination.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8 text-left">
                        <div className="bg-white p-8 border border-midnight-navy/10 rounded-sm shadow-sm hover:shadow-md transition-all duration-500">
                            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-brushed-gold mb-4">Malaysia Relations</h4>
                            <p className="text-sm text-midnight-navy font-normal leading-relaxed">
                                Inquiries, marketing materials, billing, and local agent training program management.
                            </p>
                        </div>
                        <div className="bg-white p-8 border border-midnight-navy/10 rounded-sm shadow-sm hover:shadow-md transition-all duration-500">
                            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-midnight-navy mb-4">Japan Operations</h4>
                            <p className="text-sm text-midnight-navy font-normal leading-relaxed">
                                Custom group costing, real-time group support, logistics vetting, and supplier relations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Resources Section */}
            <section className="py-24 bg-midnight-navy relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-2xl md:text-3xl font-serif text-white mb-6">Quick Resources for Partners</h2>
                    <p className="text-white/50 font-light mb-12 text-sm max-w-xl mx-auto">
                        Don't want to wait? Get started immediately with our latest self-service tools:
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

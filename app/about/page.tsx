import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { ShieldCheck, Globe, Users, CheckCircle, Feather, ArrowRight, MapPin, Building2, Briefcase } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="relative min-h-screen bg-off-white text-midnight-navy selection:bg-brushed-gold/20">
            <Navbar />

            {/* Hero Section - The Bridge */}
            <section className="relative min-h-[80vh] flex items-center justify-center pt-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero_three.jpeg" // Using a serene temple/landscape image
                        alt="Serene Japan Landscape"
                        fill
                        className="object-cover brightness-[0.6] scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-midnight-navy/60 via-midnight-navy/40 to-off-white"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brushed-gold/10 border border-brushed-gold/20 mb-8 animate-fade-in">
                        <ShieldCheck className="w-4 h-4 text-brushed-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                            Official B2B Travel Partner
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-serif text-white mb-8 font-medium leading-[1.1] tracking-tight">
                        About Feel Japan with K:<br />
                        <span className="italic font-light text-brushed-gold">Your Direct Bridge to Japan</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-10">
                        Eliminating the compromise between local accountability and ground-level expertise.
                    </p>
                    <div className="w-px h-24 bg-gradient-to-b from-brushed-gold/60 to-transparent mx-auto"></div>
                </div>
            </section>

            {/* The Power of Two Section */}
            <section className="py-24 md:py-32 bg-off-white relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-10px font-bold uppercase tracking-[0.4em] text-brushed-gold">
                                The Symbiotic Partnership
                            </h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-midnight-navy leading-tight">
                                The Power of Two: <br />
                                <span className="italic">Tokyo Expertise, Malaysian Service</span>
                            </h3>
                            <div className="space-y-6 text-lg font-light text-midnight-navy/70 leading-relaxed">
                                <p>
                                    Most travel agents face a choice: work with a distant Japanese company they don’t know, or a local agent who has never been to Japan. <strong className="text-midnight-navy font-normal">Feel Japan with K eliminates that compromise.</strong>
                                </p>
                                <p>
                                    We are a licensed Tokyo-based Travel Agency (Feel Japan with K Co. Ltd) partnered exclusively with Ark Alliance Sdn Bhd in Kuala Lumpur. This unique structure ensures our partners get the best of both worlds.
                                </p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-1 gap-6">
                            {[
                                {
                                    icon: Globe,
                                    title: "Ground-Level Accuracy",
                                    desc: "Real-time updates and direct coordination from our team living and working in Tokyo.",
                                    tag: "Tokyo HQ"
                                },
                                {
                                    icon: Users,
                                    title: "Local Accountability",
                                    desc: "A dedicated Malaysian partner in your time zone, speaking your language, and handling your currency.",
                                    tag: "KL Partner"
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Official Licensing",
                                    desc: "The peace of mind that comes with working with a registered, bonded Japanese operator.",
                                    tag: "Compliance"
                                }
                            ].map((item, i) => (
                                <div key={i} className="group bg-white p-8 border border-midnight-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-sm">
                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 rounded-full bg-brushed-gold/5 flex items-center justify-center shrink-0 group-hover:bg-brushed-gold group-hover:text-white transition-colors">
                                            <item.icon className="w-6 h-6 text-brushed-gold group-hover:text-white" />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-brushed-gold/60 mb-2 block">{item.tag}</span>
                                            <h4 className="text-xl font-serif text-midnight-navy mb-2">{item.title}</h4>
                                            <p className="text-sm text-midnight-navy/50 font-light leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 md:py-32 bg-midnight-navy relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <Image src="/hero_faith.jpeg" alt="Decorative" fill className="object-cover grayscale" />
                </div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-[1px] bg-brushed-gold/40 mx-auto mb-10"></div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-10 leading-tight">
                        Our Mission: <span className="italic italic text-brushed-gold">Redefining Muslim-Friendly Travel</span>
                    </h2>
                    <div className="space-y-8 text-xl font-extralight text-white/70 leading-relaxed italic">
                        <p>
                            \"Personally lead by Mr. Rosli Seth, our mission is to empower Malaysian travel agencies to sell Japan with absolute confidence. We don’t just 'check for Halal food'—we curate experiences that honor the traveler’s faith while celebrating Japan’s rich traditions.\"
                        </p>
                        <p>
                            \"We believe that Japan’s beauty should be accessible to everyone without compromising on religious values. Through the spirit of Omotenashi (Japanese hospitality), we provide the localized support and vetted resources that Malaysian travel professionals need to succeed in this growing market.\"
                        </p>
                    </div>
                    <div className="w-16 h-[1px] bg-brushed-gold/40 mx-auto mt-10"></div>
                </div>
            </section>

            {/* Why Travel Agents Partner With Us */}
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-10px font-bold uppercase tracking-[0.4em] text-brushed-gold">The Value Proposition</h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-midnight-navy">Why Travel Agents Partner With Us</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Muslim-Friendly Compliances",
                                desc: "Every itinerary, restaurant, and prayer space has been personally reviewed for quality and religious compliance."
                            },
                            {
                                title: "B2B Focused Support",
                                desc: "We provide ready-to-use marketing assets and seamless logistics so you can focus on the sale."
                            },
                            {
                                title: "Authentic 'Off-Path' Access",
                                desc: "Beyond typical tourist traps, we offer your clients the 'Real Japan' through our deep local networks."
                            },
                            {
                                title: "Cultural Fluency",
                                desc: "We understand the nuances and expectations of the Malaysian traveler better than anyone else."
                            }
                        ].map((benefit, i) => (
                            <div key={i} className="p-8 border-l border-midnight-navy/5 hover:border-brushed-gold transition-colors duration-500">
                                <div className="text-3xl font-serif text-brushed-gold/20 mb-6">0{i + 1}</div>
                                <h4 className="text-xl font-serif text-midnight-navy mb-4 leading-snug">{benefit.title}</h4>
                                <p className="text-sm text-midnight-navy/60 font-light leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet the Team */}
            <section className="py-24 md:py-32 bg-[#F8F8F8]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden rounded-sm group shadow-2xl">
                            {/* Placeholder for "The Handshake" Photo */}
                            <div className="absolute inset-0 flex items-center justify-center text-midnight-navy/20 font-serif italic text-xl group-hover:scale-110 transition-transform duration-[3s]">
                                [ Photo: The Handshake - Mr. Rosli Seth ]
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/40 to-transparent"></div>
                            <div className="absolute bottom-10 left-10 text-white">
                                <p className="text-2xl font-serif">Mr. Rosli Seth</p>
                                <p className="text-xs uppercase tracking-[0.3em] font-bold text-brushed-gold">Official Lead Representative for Feel Japan with K</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h2 className="text-10px font-bold uppercase tracking-[0.4em] text-brushed-gold leading-relaxed">Meet the Leadership</h2>
                            <blockquote className="space-y-6">
                                <p className="text-3xl md:text-4xl font-serif text-midnight-navy italic leading-snug">
                                    \"Our goal is to be more than a supplier; we want to be your most trusted consultant in Japan. When you work with us, you aren't just booking a tour—you’re gaining a partner dedicated to your agency&apos;s growth.\"
                                </p>
                                <footer className="pt-6 border-t border-midnight-navy/10 flex items-center gap-4">
                                    <div className="w-10 h-[1px] bg-brushed-gold"></div>
                                    <cite className="not-italic">
                                        <span className="block text-lg font-serif text-midnight-navy">Rosli Seth</span>
                                        <span className="block text-xs uppercase tracking-widest text-midnight-navy/50 font-light mt-1 text-justify md:text-left">A veteran of 25 years in Japan tourism</span>
                                    </cite>
                                </footer>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-midnight-navy relative overflow-hidden text-center">
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">Ready to elevate your Japan offerings?</h2>
                    <p className="text-white/60 font-light mb-12 text-lg">
                        Gain immediate access to our latest 2026 travel resources and start crafting bespoke journeys for your clients today.
                    </p>
                    <Link
                        href="/partner-resources"
                        className="inline-flex items-center gap-4 bg-brushed-gold text-white px-10 py-5 rounded-sm text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-midnight-navy transition-all duration-500 shadow-2xl group"
                    >
                        Download our 2026 B2B Brochure
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}

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
                                The Compatibility Partnership
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
                                    icon: CheckCircle,
                                    title: "Reliability",
                                    desc: "We ensure consistent, high-quality experiences by working closely with trusted local partners and reliably delivering on what we promise.",
                                    tag: "Our Commitments"
                                },
                                {
                                    icon: Users,
                                    title: "Responsibility",
                                    desc: "We are deeply committed to sustainable travel and hold ourselves accountable to our clients, partners, and the communities we visit.",
                                    tag: "Our Commitments"
                                },
                                {
                                    icon: Briefcase,
                                    title: "Capability",
                                    desc: "Our specialized team possesses the deep local knowledge and operational strength needed to craft exceptional, seamless itineraries.",
                                    tag: "Our Commitments"
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Compliance & Regulatory",
                                    desc: "We strictly adhere to all travel regulations, working exclusively with fully licensed and regulated suppliers for your complete peace of mind.",
                                    tag: "Our Commitments"
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
                        Our Mission: <span className="italic text-brushed-gold">Delivering Trusted Muslim-Friendly Experiences</span>
                    </h2>
                    <div className="space-y-8 text-xl font-extralight text-white/70 leading-relaxed italic">
                        <p>
                            &quot;Our mission is simple yet profound: to deliver the absolute best of what Japan has to offer, fully immersing travelers in the heart of its culture, scenery, and hospitality, without ever forgetting or compromising on Muslim needs and values.&quot;
                        </p>
                        <p>
                            &quot;Through the spirit of Omotenashi (Japanese hospitality), we curate every journey meticulously. By combining world-class attractions with thoughtfully vetted, authentic halal dining and prayer facilities, we ensure that every experience honors both the breathtaking beauty of Japan and the core principles of your faith.&quot;
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
                                desc: "Every itinerary, restaurant, and prayer space has been carefully selected and vetted for quality and religious compliance."
                            },
                            {
                                title: "Travel Agents Focused Support",
                                desc: "We provide our B2B partners with ready-to-use marketing assets and seamless logistics so you can focus on the sale."
                            },
                            {
                                title: "On-Hand Experience",
                                desc: "Our itineraries are crafted from genuine, practical experience, ensuring every route and activity is designed for optimal execution on the ground."
                            },
                            {
                                title: "Cultural Fluency",
                                desc: "We have a deep understanding of the nuances, preferences, and expectations of the Malaysian traveler to ensure a comfortable journey."
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


            {/* Final CTA */}
            <section className="py-24 bg-midnight-navy relative overflow-hidden text-center">
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">Let&apos;s create An Unforgettable Itinerary for your clients.</h2>
                    <p className="text-white/60 font-light mb-12 text-lg">
                        Gain immediate access to our latest 2026 travel resources and start crafting bespoke journeys for your clients today.
                    </p>
                    <Link
                        href="/partner-resources"
                        className="inline-flex items-center gap-4 bg-brushed-gold text-white px-10 py-5 rounded-sm text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-midnight-navy transition-all duration-500 shadow-2xl group"
                    >
                        Download our 2026 B2B Leaflet
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}

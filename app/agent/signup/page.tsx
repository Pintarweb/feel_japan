"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Mail, ArrowRight, Star, ShieldCheck, Heart, Loader2, ArrowLeft, Building2, FileText, MapPin, User, Briefcase, Phone } from 'lucide-react';
import Link from 'next/link';

export default function AgentSignupPage() {
    const [email, setEmail] = useState("");
    const [agencyName, setAgencyName] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [address, setAddress] = useState("");
    const [fullName, setFullName] = useState("");
    const [designation, setDesignation] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        agency_name: agencyName,
                        license_number: licenseNumber,
                        address: address,
                        full_name: fullName,
                        designation: designation,
                        phone: phone,
                    }
                },
            });

            if (error) throw error;

            // 2. Trigger Notifications (Welcome Email + Admin Alert)
            try {
                await fetch('/api/auth/signup-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        agency_name: agencyName,
                        license_number: licenseNumber,
                        address: address,
                        full_name: fullName,
                        designation: designation,
                        phone: phone,
                        email: email
                    })
                });
            } catch (notifyErr) {
                console.error("Notification failed:", notifyErr);
            }

            setMessage({
                type: 'success',
                text: "Success! We've sent your Login Link and a Welcome Email to your inbox. Please check your email to complete your partner profile."
            });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "An error occurred during sign up." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lg:h-screen bg-[#f1f3f5] flex flex-col font-sans relative lg:overflow-hidden">
            {/* Header - Consistent with Homepage */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-2 bg-white/40 backdrop-blur-xl border-b border-midnight-navy/5 h-20 md:h-24 w-full">
                <Link href="/" className="flex items-center justify-center h-full transition-transform hover:scale-105 duration-700">
                    <img
                        src="/logo_transparent.png"
                        alt="Feel Japan"
                        className="h-[140%] w-auto object-contain mt-2"
                    />
                </Link>
                <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-midnight-navy hover:text-brushed-gold transition-all border-b-2 border-midnight-navy/30 hover:border-brushed-gold pb-1 px-2 group/back">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover/back:-translate-x-1" />
                    Back
                </Link>
            </nav>

            <div className="flex-1 grid lg:grid-cols-2 relative z-10 w-full overflow-hidden">
                {/* Left Side: Marketing Content (Split Screen) */}
                <div className="hidden lg:flex flex-col justify-center p-24 bg-midnight-navy text-white relative overflow-hidden group">
                    {/* Background Visual */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop"
                            alt="Japan"
                            className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-midnight-navy via-transparent to-brushed-gold/20"></div>
                    </div>

                    <div className="relative space-y-16">
                        <div className="space-y-6">
                            <span className="text-brushed-gold text-xs font-bold uppercase tracking-[0.6em] block animate-in fade-in slide-in-from-left-6 duration-1000">Partner Program</span>
                            <h2 className="text-6xl xl:text-7xl font-serif italic text-white leading-[1.1] animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
                                Empower your <br />Agency with <br /><span className="text-brushed-gold">Confidential Access.</span>
                            </h2>
                        </div>

                        <div className="space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000 delay-500">
                            {[
                                { icon: Star, title: "Exclusive Net Rates", desc: "Unlock confidential B2B pricing for all our heritage itineraries." },
                                { icon: ShieldCheck, title: "Client-Ready Mode", desc: "Instantly hide pricing to present brochures directly to your clients." },
                                { icon: Heart, title: "Bespoke Support", desc: "Priority design support for your most demanding partner requests." }
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-8 items-start group/benefit">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 group-hover/benefit:bg-brushed-gold transition-all duration-500 group-hover/benefit:scale-110 group-hover/benefit:rotate-3 shadow-lg">
                                        <benefit.icon className="w-7 h-7 text-brushed-gold/80 group-hover/benefit:text-white transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base uppercase tracking-[0.2em]">{benefit.title}</h4>
                                        <p className="text-white/90 text-sm leading-relaxed max-w-sm">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute bottom-12 left-12 w-32 h-[1px] bg-white/10 animate-in fade-in expand-horizontal duration-1000 delay-1000"></div>
                </div>

                {/* Right Side: Signup Form */}
                <div className="flex items-center justify-center p-8 lg:p-12 relative h-full overflow-y-auto bg-[#f1f3f5]">
                    {/* Atmospheric Glows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brushed-gold/[0.04] blur-[150px] pointer-events-none"></div>

                    <div className="max-w-xl w-full animate-in fade-in slide-in-from-right-12 duration-1000 relative z-10 py-12">
                        <div className="text-center mb-10">
                            <h1 className="text-5xl font-serif font-bold text-midnight-navy mb-4 italic tracking-tight">Join the Network</h1>
                            <p className="text-midnight-navy text-xs uppercase font-bold tracking-[0.4em] underline underline-offset-8 decoration-brushed-gold/30 inline-block">Become a Registered Partner</p>
                        </div>

                        <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-[0_48px_96px_-24px_rgba(0,26,51,0.12)] border border-midnight-navy/[0.05] relative overflow-hidden group">
                            {/* Accent Circle */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brushed-gold/[0.08] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>

                            {message ? (
                                <div className={`p-10 rounded-[2.5rem] text-base leading-relaxed text-center animate-in zoom-in-95 duration-500 ${message.type === 'success' ? 'bg-green-50 text-green-900 border border-green-100' : 'bg-red-50 text-red-900 border border-red-100'}`}>
                                    <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/10">
                                        {message.type === 'success' ? <ShieldCheck className="w-10 h-10 text-green-600" /> : <Mail className="w-10 h-10 text-red-600" />}
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold mb-4">{message.type === 'success' ? 'Email Sent!' : 'Error'}</h3>
                                    <p className="text-sm opacity-95">{message.text}</p>
                                    {message.type === 'success' && (
                                        <div className="mt-8 pt-6 border-t border-green-200/50">
                                            <p className="text-[11px] text-green-700/60 uppercase tracking-widest font-bold">Check your inbox to continue.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleSignup} className="space-y-8">
                                    {/* Agency Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="h-[2px] w-8 bg-brushed-gold/30"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-midnight-navy/90">Agency Information</span>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy ml-4">Agency Name</label>
                                                <div className="relative group/input">
                                                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-navy/60 group-focus-within/input:text-brushed-gold transition-colors" />
                                                    <input
                                                        type="text" required value={agencyName} onChange={(e) => setAgencyName(e.target.value)}
                                                        placeholder="e.g. Luxury Travels Ltd"
                                                        className="w-full bg-[#f9fafb] border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 focus:bg-white focus:border-brushed-gold/30 outline-none transition-all text-base text-midnight-navy font-medium placeholder:text-midnight-navy/40"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy ml-4">License Number</label>
                                                <div className="relative group/input">
                                                    <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-navy/60 group-focus-within/input:text-brushed-gold transition-colors" />
                                                    <input
                                                        type="text" required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)}
                                                        placeholder="e.g. KPL-12345"
                                                        className="w-full bg-[#f9fafb] border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 focus:bg-white focus:border-brushed-gold/30 outline-none transition-all text-base text-midnight-navy font-medium placeholder:text-midnight-navy/40"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy ml-4">Office Address</label>
                                            <div className="relative group/input">
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-navy/60 group-focus-within/input:text-brushed-gold transition-colors" />
                                                <input
                                                    type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                                                    placeholder="Full business address"
                                                    className="w-full bg-[#f9fafb] border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 focus:bg-white focus:border-brushed-gold/30 outline-none transition-all text-base text-midnight-navy font-medium placeholder:text-midnight-navy/40"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="h-[2px] w-8 bg-brushed-gold/30"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-midnight-navy/90">Contact Person</span>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy ml-4">Full Name</label>
                                                <div className="relative group/input">
                                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-navy/60 group-focus-within/input:text-brushed-gold transition-colors" />
                                                    <input
                                                        type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                                                        placeholder="Your Name"
                                                        className="w-full bg-[#f9fafb] border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 focus:bg-white focus:border-brushed-gold/30 outline-none transition-all text-base text-midnight-navy font-medium placeholder:text-midnight-navy/40"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy ml-4">Designation</label>
                                                <div className="relative group/input">
                                                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-navy/60 group-focus-within/input:text-brushed-gold transition-colors" />
                                                    <input
                                                        type="text" required value={designation} onChange={(e) => setDesignation(e.target.value)}
                                                        placeholder="e.g. Agency Manager"
                                                        className="w-full bg-[#f9fafb] border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 focus:bg-white focus:border-brushed-gold/30 outline-none transition-all text-base text-midnight-navy font-medium placeholder:text-midnight-navy/40"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy ml-4">Work Phone</label>
                                                <div className="relative group/input">
                                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-navy/60 group-focus-within/input:text-brushed-gold transition-colors" />
                                                    <input
                                                        type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="+60..."
                                                        className="w-full bg-[#f9fafb] border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 focus:bg-white focus:border-brushed-gold/30 outline-none transition-all text-base text-midnight-navy font-medium placeholder:text-midnight-navy/40"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy ml-4">Work Email</label>
                                                <div className="relative group/input">
                                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-navy/60 group-focus-within/input:text-brushed-gold transition-colors" />
                                                    <input
                                                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="agent@agency.com"
                                                        className="w-full bg-[#f9fafb] border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 focus:bg-white focus:border-brushed-gold/30 outline-none transition-all text-base text-midnight-navy font-medium placeholder:text-midnight-navy/40"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-midnight-navy text-white py-6 rounded-2xl text-[11px] font-bold tracking-[0.4em] uppercase shadow-[0_24px_48px_-12px_rgba(0,26,51,0.4)] hover:bg-midnight-navy/90 hover:-translate-y-1.5 active:translate-y-0 transition-all flex items-center justify-center gap-4 group/btn"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Request Partner Access
                                                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-3" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            <div className="mt-10 pt-8 border-t border-midnight-navy/[0.08] text-center">
                                <p className="text-midnight-navy text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Already registered?</p>
                                <Link
                                    href="/agent/login"
                                    className="text-brushed-gold text-[10px] font-bold uppercase tracking-[0.3em] hover:text-midnight-navy transition-colors"
                                >
                                    Sign In to Portal
                                </Link>
                            </div>
                        </div>

                        <div className="text-center mt-10 space-y-2 opacity-80">
                            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-midnight-navy">
                                Secure Partner Transmission
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-midnight-navy">
                                &copy; 2026 Feel Japan K. All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

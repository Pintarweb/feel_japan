"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Mail, ArrowRight, ShieldCheck, Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AgentLoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
            setMessage({ type: 'success', text: "Verification link sent! Please check your inbox to sign in." });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "An error occurred during login." });
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
                {/* Left Side: Welcoming Visual (Desktop Only) */}
                <div className="hidden lg:flex relative overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop"
                        alt="Welcome to Japan"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-midnight-navy/60 via-midnight-navy/20 to-transparent"></div>

                    <div className="relative z-20 p-24 flex flex-col justify-center h-full space-y-8">
                        <div className="space-y-4">
                            <span className="text-brushed-gold text-xs font-bold uppercase tracking-[0.6em] block animate-in fade-in slide-in-from-left-8 duration-1000">Welcome Home</span>
                            <h2 className="text-7xl xl:text-8xl font-serif italic text-white leading-[1.1] animate-in fade-in slide-in-from-left-12 duration-1000 delay-200">
                                Step into the <br /><span className="text-brushed-gold">Heart of Japan.</span>
                            </h2>
                        </div>
                        <p className="text-white text-lg max-w-md font-medium leading-relaxed animate-in fade-in slide-in-from-left-16 duration-1000 delay-400">
                            Your exclusive gateway to authentic heritage experiences and confidential partner resources.
                        </p>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute bottom-12 left-12 w-32 h-[1px] bg-white/20 animate-in fade-in expand-horizontal duration-1000 delay-700"></div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex items-center justify-center p-8 lg:p-12 relative h-full overflow-y-auto lg:overflow-hidden bg-[#f1f3f5]">
                    {/* Atmospheric Glows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brushed-gold/[0.04] blur-[150px] pointer-events-none"></div>

                    <div className="max-w-md w-full animate-in fade-in slide-in-from-right-12 duration-1000 relative z-10 py-12">
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-serif font-bold text-midnight-navy mb-5 italic tracking-tight">Member Login</h1>
                            <p className="text-midnight-navy text-xs uppercase font-bold tracking-[0.4em] underline underline-offset-8 decoration-brushed-gold/30 inline-block">Partner Network Entry</p>
                        </div>

                        <div className="bg-white rounded-[3.5rem] p-12 lg:p-14 shadow-[0_48px_96px_-24px_rgba(0,26,51,0.12)] border border-midnight-navy/[0.05] relative overflow-hidden group">
                            {/* Accent Circle */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brushed-gold/[0.08] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>

                            {message ? (
                                <div className={`p-10 rounded-[2.5rem] text-base leading-relaxed text-center animate-in zoom-in-95 duration-500 ${message.type === 'success' ? 'bg-green-50 text-green-900 border border-green-100' : 'bg-red-50 text-red-900 border border-red-100'}`}>
                                    <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/10">
                                        {message.type === 'success' ? <ShieldCheck className="w-10 h-10 text-green-600" /> : <Mail className="w-10 h-10 text-red-600" />}
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold mb-4">{message.type === 'success' ? 'Verification Sent!' : 'Login Error'}</h3>
                                    <p className="text-sm opacity-95">{message.text}</p>
                                    {message.type === 'success' && (
                                        <div className="mt-8 pt-6 border-t border-green-200/50">
                                            <p className="text-[11px] text-green-700/60 uppercase tracking-widest font-bold">Please check your inbox to continue.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleLogin} className="space-y-10">
                                    <div className="space-y-4 text-left">
                                        <label className="text-xs uppercase tracking-[0.3em] font-bold text-midnight-navy ml-4">Registered Work Email</label>
                                        <div className="relative group/input">
                                            <Mail className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-midnight-navy/90 group-focus-within/input:text-brushed-gold transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="e.g. agent@agency.com"
                                                className="w-full bg-[#f9fafb] border-2 border-transparent rounded-[2rem] pl-16 pr-8 py-7 focus:bg-white focus:border-brushed-gold/30 focus:ring-8 focus:ring-brushed-gold/[0.04] outline-none transition-all text-lg text-midnight-navy font-medium placeholder:text-midnight-navy/40"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-midnight-navy text-white py-7 rounded-[2.5rem] text-sm font-bold tracking-[0.4em] uppercase shadow-[0_24px_48px_-12px_rgba(0,26,51,0.4)] hover:bg-midnight-navy/90 hover:-translate-y-1.5 active:translate-y-0 transition-all flex items-center justify-center gap-4 group/btn"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                Sign In to Portal
                                                <ArrowRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-3" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            <div className="mt-14 pt-10 border-t border-midnight-navy/[0.08] text-center">
                                <p className="text-midnight-navy text-[11px] font-bold uppercase tracking-[0.3em] mb-8">New Partner?</p>
                                <Link
                                    href="/agent/signup"
                                    className="flex items-center justify-center gap-4 text-brushed-gold text-xs font-bold uppercase tracking-[0.3em] border-2 border-brushed-gold/30 px-10 py-6 rounded-[2.5rem] hover:bg-brushed-gold hover:text-white hover:border-brushed-gold transition-all w-full shadow-2xl shadow-brushed-gold/[0.05] group/signup"
                                >
                                    <UserPlus className="w-5 h-5 flex-shrink-0" />
                                    Create Partner Account
                                </Link>
                            </div>
                        </div>

                        <div className="text-center mt-12 space-y-2 opacity-80">
                            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-midnight-navy">
                                Secure B2B Transmission
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

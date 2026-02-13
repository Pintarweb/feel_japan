"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Lock, ArrowRight, ShieldCheck, Loader2, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SetupPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check if user is actually logged in (from Magic Link)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/agent/login');
            }
        };
        checkSession();
    }, [router]);

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus({ type: 'error', text: "Passwords do not match." });
            return;
        }

        if (password.length < 8) {
            setStatus({ type: 'error', text: "Password must be at least 8 characters long." });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setStatus({
                type: 'success',
                text: "Your password has been set successfully. Welcome to the Partner Network."
            });

            // Brief delay before redirecting to dashboard or home
            setTimeout(() => {
                router.push('/');
            }, 2000);

        } catch (err: any) {
            setStatus({ type: 'error', text: err.message || "Failed to set password." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f3f5] flex flex-col font-sans relative">
            <nav className="flex items-center justify-between px-8 py-2 bg-white border-b border-midnight-navy/5 h-20 w-full relative z-10">
                <Link href="/" className="flex items-center justify-center h-full transition-transform hover:scale-105 duration-700">
                    <img src="/logo_transparent.png" alt="Feel Japan" className="h-[140%] w-auto object-contain mt-2" />
                </Link>
            </nav>

            <div className="flex-1 flex items-center justify-center p-8 bg-midnight-navy relative overflow-hidden">
                {/* Visual Background */}
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop"
                        alt="Japan Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-midnight-navy via-midnight-navy/80 to-brushed-gold/20"></div>

                <div className="max-w-md w-full relative z-10">
                    <div className="text-center mb-10">
                        <span className="text-brushed-gold text-[10px] font-bold uppercase tracking-[0.5em] block mb-4 animate-in fade-in slide-in-from-bottom-4">Finalizing Access</span>
                        <h1 className="text-4xl font-serif font-bold text-white mb-4 italic">Security Setup</h1>
                        <p className="text-white/60 text-xs uppercase font-bold tracking-[0.3em]">Formalize your Partner Credentials</p>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-white/10 relative overflow-hidden group">
                        {status?.type === 'success' ? (
                            <div className="text-center py-8 animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                    <ShieldCheck className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-midnight-navy mb-4">Account Secured</h3>
                                <p className="text-sm text-midnight-navy/60 leading-relaxed">{status.text}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSetPassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy ml-4">New Password</label>
                                    <div className="relative group/input">
                                        <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-navy/30 group-focus-within/input:text-brushed-gold transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-[#f9fafb] border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 focus:bg-white focus:border-brushed-gold/20 outline-none transition-all text-base text-midnight-navy font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy ml-4">Confirm Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-navy/30 group-focus-within/input:text-brushed-gold transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-[#f9fafb] border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 focus:bg-white focus:border-brushed-gold/20 outline-none transition-all text-base text-midnight-navy font-medium"
                                        />
                                    </div>
                                </div>

                                {status?.type === 'error' && (
                                    <p className="text-red-500 text-[11px] font-bold uppercase tracking-widest text-center">{status.text}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-midnight-navy text-white py-6 rounded-2xl text-[10px] font-bold tracking-[0.4em] uppercase shadow-xl hover:bg-midnight-navy/90 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 mt-4"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            Secure Account
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    <p className="text-center mt-8 text-[9px] text-white/40 uppercase font-bold tracking-[0.3em]">
                        Feel Japan with K • Professional Trade Encryption
                    </p>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Building2, Landmark, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function AgentOnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [agencyName, setAgencyName] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        checkSession();
    }, []);

    async function checkSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/agent/login');
            return;
        }

        // Check if profile already exists
        const { data: profile } = await supabase
            .from('agent_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profile && profile.agency_name) {
            // Already onboarded, redirect to portfolio
            router.push('/#collections');
        } else {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error: upsertError } = await supabase
                .from('agent_profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    agency_name: agencyName,
                    license_number: licenseNumber,
                    is_verified: false // Must be manually verified by admin
                });

            if (upsertError) throw upsertError;

            router.push('/agent/thank-you');
        } catch (err: any) {
            setError(err.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-midnight-navy/20" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-midnight-navy/5 border border-midnight-navy/5 relative overflow-hidden">
                        <div className="relative">
                            <h1 className="text-3xl font-serif font-bold text-midnight-navy mb-3 italic text-center">Complete Profile</h1>
                            <p className="text-midnight-navy/40 text-[10px] uppercase font-bold tracking-[0.3em] mb-10 text-center">B2B Agent Registration</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy/40 ml-2">Agency Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-navy/30" />
                                        <input
                                            required
                                            value={agencyName}
                                            onChange={(e) => setAgencyName(e.target.value)}
                                            placeholder="Your Travel Agency Co."
                                            className="w-full bg-[#f8f9fa] border-none rounded-2xl pl-12 pr-6 py-5 focus:ring-2 focus:ring-brushed-gold/30 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy/40 ml-2">MOTAC License Number</label>
                                    <div className="relative">
                                        <Landmark className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-navy/30" />
                                        <input
                                            required
                                            value={licenseNumber}
                                            onChange={(e) => setLicenseNumber(e.target.value)}
                                            placeholder="KPL/LN-12345"
                                            className="w-full bg-[#f8f9fa] border-none rounded-2xl pl-12 pr-6 py-5 focus:ring-2 focus:ring-brushed-gold/30 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-midnight-navy text-white py-5 rounded-2xl text-[10px] font-bold tracking-[0.3em] uppercase shadow-xl shadow-midnight-navy/20 hover:bg-midnight-navy/90 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 group"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <>
                                            Submit for Verification
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

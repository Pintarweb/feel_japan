"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Brochure } from '@/types/brochure';
import {
    Trash2,
    RefreshCw,
    Search,
    TrendingUp,
    FileText,
    MessageSquare,
    Calendar,
    ExternalLink,
    Clock,
    ShieldAlert,
    LogOut,
    Eye,
    Edit3,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import Gatekeeper from '@/components/studio/Gatekeeper';

export default function StudioArchive() {
    const router = useRouter();
    const [brochures, setBrochures] = useState<Brochure[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [inquiriesCount, setInquiriesCount] = useState(0);
    const [unverifiedCount, setUnverifiedCount] = useState(0);

    const handleExit = () => {
        if (confirm("Sign out and exit Studio?")) {
            sessionStorage.removeItem('studio_authorized');
            router.push('/');
        }
    };

    useEffect(() => {
        fetchArchivedBrochures();
    }, []);

    async function fetchArchivedBrochures() {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('brochures')
                .select('*')
                .eq('is_archived', true)
                .order('created_at', { ascending: false });
            if (data) setBrochures(data);

            // Fetch Inquiries Count
            const { count } = await supabase
                .from('inquiries')
                .select('*', { count: 'exact', head: true });
            if (count !== null) setInquiriesCount(count);

            // Fetch Unverified Count
            const { count: uCount } = await supabase
                .from('inquiries')
                .select('*', { count: 'exact', head: true })
                .eq('motac_verified', false)
                .not('license_number', 'is', null);
            if (uCount !== null) setUnverifiedCount(uCount);
        } catch (err) {
            console.error('Error fetching archive:', err);
        } finally {
            setLoading(false);
        }
    }

    async function restoreBrochure(id: string) {
        try {
            const { error } = await supabase
                .from('brochures')
                .update({ is_archived: false })
                .eq('id', id);
            if (error) throw error;
            setBrochures(brochures.filter(b => b.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to restore.');
        }
    }

    async function permanentDeleteBrochure(id: string) {
        const firstConfirm = confirm("CRITICAL: Are you absolutely sure you want to permanently erase this heritage asset?");
        if (!firstConfirm) return;

        const secondConfirm = confirm("FINAL WARNING: This action is IRREVERSIBLE and will delete all data related to this brochure from the database. This cannot be undone. Are you sure you want to proceed?");
        if (!secondConfirm) return;

        try {
            const { error } = await supabase.from('brochures').delete().eq('id', id);
            if (error) throw error;
            setBrochures(brochures.filter(b => b.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete permanently.');
        }
    }

    const filteredBrochures = brochures.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Gatekeeper>
            <div className="min-h-screen bg-[#f8f9fa] flex text-midnight-navy font-sans">
                {/* Sidebar */}
                <aside className="w-64 bg-midnight-navy text-white flex flex-col fixed h-full z-20">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-brushed-gold rounded-lg flex items-center justify-center font-serif font-bold text-midnight-navy text-xs">FJ</div>
                            <span className="font-serif font-bold tracking-tight text-xl">Studio</span>
                        </div>

                        <nav className="space-y-1">
                            <Link href="/manage-studio" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">Dashboard</span>
                            </Link>
                            <Link href="/manage-studio/brochures" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">Packages</span>
                            </Link>
                            <Link href="/manage-studio/inquiries" className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white group">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-sm font-medium tracking-wide">Inquiries</span>
                                </div>
                                {inquiriesCount > 0 && (
                                    <span className="bg-brushed-gold text-midnight-navy text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md border border-white/20">
                                        {inquiriesCount}
                                    </span>
                                )}
                            </Link>
                            <Link href="/manage-studio/verify" className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white group">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-sm font-medium tracking-wide">Agent Verification</span>
                                </div>
                                {unverifiedCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md border border-white/20 animate-pulse">
                                        {unverifiedCount}
                                    </span>
                                )}
                            </Link>
                            <Link href="/manage-studio/planner" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">FIT Planner</span>
                            </Link>
                            <Link href="/manage-studio/archive" className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-xl text-brushed-gold group">
                                <div className="flex items-center gap-3">
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm font-medium tracking-wide">Archive</span>
                                </div>
                                {brochures.length > 0 && (
                                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors shadow-sm">
                                        {brochures.length}
                                    </span>
                                )}
                            </Link>
                        </nav>
                    </div>

                    <div className="mt-auto p-8 space-y-1">
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm font-medium tracking-wide">Visit Site</span>
                        </Link>
                        <button
                            onClick={handleExit}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-xl transition-colors text-white/40 hover:text-red-400"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium tracking-wide">Exit Studio</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64 p-10 bg-[#fefefe]">
                    <header className="flex justify-between items-end mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldAlert className="w-5 h-5 text-red-500" />
                                <h1 className="text-4xl font-serif font-bold text-midnight-navy italic">Vault Archive</h1>
                            </div>
                            <p className="text-midnight-navy/40 text-[10px] uppercase font-bold tracking-[0.4em]">Decommissioned heritage assets and retired packages</p>
                        </div>

                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-midnight-navy/30" />
                            <input
                                type="text"
                                placeholder="Search archive..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 pr-6 py-3 bg-[#f8f9fa] border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-brushed-gold/20 transition-all w-72"
                            />
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-[#f8f9fa] rounded-[3rem] border border-dashed border-midnight-navy/10">
                            <div className="w-8 h-8 border-2 border-brushed-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-midnight-navy/40">Accessing Vault...</span>
                        </div>
                    ) : filteredBrochures.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-[#f8f9fa] rounded-[3rem] border border-dashed border-midnight-navy/10 text-center">
                            <Trash2 className="w-12 h-12 text-midnight-navy/10 mb-6" />
                            <h3 className="text-lg font-serif font-bold text-midnight-navy/40">Archive Empty</h3>
                            <p className="text-xs text-midnight-navy/30 mt-1 max-w-xs">No brochures have been archived yet. Your main package list is clean.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBrochures.map((b) => (
                                <div key={b.id} className="bg-white p-8 rounded-[2rem] border border-midnight-navy/5 shadow-sm hover:shadow-md transition-all flex items-center gap-10 group">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                        <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-serif font-bold text-midnight-navy/60 group-hover:text-midnight-navy transition-colors">{b.title}</h3>
                                        <div className="flex items-center gap-4 mt-1 text-[9px] uppercase tracking-widest font-bold text-midnight-navy/30">
                                            <span className="flex items-center gap-1.5 line-through">ARCHIVED_ID: {b.slug}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Decommissioned on {new Date(b.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-2">
                                            <Link href={`/brochures/${encodeURIComponent(b.slug)}`} target="_blank" className="p-3 bg-midnight-navy/5 text-midnight-navy rounded-xl hover:bg-midnight-navy hover:text-white transition-all shadow-sm" title="Live Preview">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/manage-studio/builder?id=${b.id}`} className="p-3 bg-midnight-navy/5 text-midnight-navy rounded-xl hover:bg-midnight-navy hover:text-white transition-all shadow-sm" title="Studio Editor">
                                                <Edit3 className="w-4 h-4" />
                                            </Link>
                                        </div>
                                        <div className="h-8 w-px bg-midnight-navy/5 mx-1"></div>
                                        <button
                                            onClick={() => restoreBrochure(b.id)}
                                            className="flex items-center gap-2 px-5 py-3 bg-midnight-navy/5 text-midnight-navy rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-midnight-navy hover:text-white transition-all shadow-sm"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                            Restore
                                        </button>
                                        <button
                                            onClick={() => permanentDeleteBrochure(b.id)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            title="Permanent Deletion"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </Gatekeeper>
    );
}

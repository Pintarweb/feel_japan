"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
    ShieldCheck, TrendingUp, FileText, MessageSquare,
    Calendar, Trash2, ExternalLink, LogOut, Search,
    ChevronRight, CheckCircle2, AlertTriangle, Copy,
    XCircle, UserCheck, Briefcase, Landmark
} from 'lucide-react';
import Link from 'next/link';
import Gatekeeper from '@/components/studio/Gatekeeper';

export default function StudioVerification() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [itemType, setItemType] = useState<'inquiry' | 'profile'>('profile');
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<'agents' | 'inquiries'>('agents');
    const [archiveCount, setArchiveCount] = useState(0);
    const [inquiriesCount, setInquiriesCount] = useState(0);

    const handleExit = () => {
        if (confirm("Sign out and exit Studio?")) {
            sessionStorage.removeItem("studio_auth");
            router.push('/');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [inqRes, profRes] = await Promise.all([
                supabase.from('inquiries').select('*').not('license_number', 'is', null).order('created_at', { ascending: false }),
                supabase.from('agent_profiles').select('*').order('created_at', { ascending: false })
            ]);

            if (inqRes.error) throw inqRes.error;
            if (profRes.error) throw profRes.error;

            setInquiries(inqRes.data || []);
            setProfiles(profRes.data || []);

            if (profRes.data?.length > 0) {
                setSelectedItem(profRes.data[0]);
                setItemType('profile');
            } else if (inqRes.data?.length > 0) {
                setSelectedItem(inqRes.data[0]);
                setItemType('inquiry');
            }

            // Fetch metadata for sidebar
            const { count: iCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('is_archived', false);
            if (iCount !== null) setInquiriesCount(iCount);

            const { count: aCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('is_archived', true);
            if (aCount !== null) setArchiveCount(aCount);

        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }

    async function toggleVerification(id: string, currentStatus: boolean, type: 'inquiry' | 'profile') {
        const newStatus = !currentStatus;
        const action = newStatus ? "VERIFY" : "REVOKE";

        if (!confirm(`Are you sure you want to ${action} this agent?`)) return;

        try {
            const { error } = await supabase
                .from(type === 'inquiry' ? 'inquiries' : 'agent_profiles')
                .update(type === 'inquiry' ? { motac_verified: newStatus } : { is_verified: newStatus })
                .eq('id', id);

            if (error) throw error;

            if (type === 'inquiry') {
                setInquiries(inquiries.map(i => i.id === id ? { ...i, motac_verified: newStatus } : i));
            } else {
                setProfiles(profiles.map(p => p.id === id ? { ...p, is_verified: newStatus } : p));
            }

            if (selectedItem?.id === id && itemType === type) {
                setSelectedItem({ ...selectedItem, [type === 'inquiry' ? 'motac_verified' : 'is_verified']: newStatus });
            }
        } catch (err) {
            console.error('Error updating verification:', err);
            alert('Failed to update verification status.');
        }
    }

    const filteredItems = (activeTab === 'agents' ? profiles : inquiries).filter(item => {
        const query = searchQuery.toLowerCase();
        return (
            (item.agency_name?.toLowerCase().includes(query) ?? false) ||
            (item.license_number?.toLowerCase().includes(query) ?? false) ||
            (item.name?.toLowerCase().includes(query) ?? false) ||
            (item.email?.toLowerCase().includes(query) ?? false)
        );
    });

    const unverifiedProfileCount = profiles.filter(p => !p.is_verified).length;
    const unverifiedInquiryCount = inquiries.filter(i => !i.motac_verified).length;
    const totalUnverified = unverifiedProfileCount + unverifiedInquiryCount;

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
                                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg group-hover:bg-brushed-gold group-hover:text-midnight-navy transition-colors">
                                        {inquiriesCount}
                                    </span>
                                )}
                            </Link>
                            <Link href="/manage-studio/verify" className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-xl text-brushed-gold group">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-sm font-medium tracking-wide">Agent Verification</span>
                                </div>
                                {totalUnverified > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md animate-pulse">
                                        {totalUnverified}
                                    </span>
                                )}
                            </Link>
                        </nav>
                    </div>

                    <div className="mt-auto p-8 border-t border-white/5 space-y-1">
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm font-medium tracking-wide">Visit Site</span>
                        </Link>
                        <button onClick={handleExit} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-xl transition-colors text-white/40 hover:text-red-400">
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium tracking-wide">Exit Studio</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64 p-10 flex gap-10">
                    <div className="flex-1 space-y-8">
                        <header className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-midnight-navy italic">Agent Licensing</h1>
                                <p className="text-midnight-navy/40 text-[10px] uppercase font-bold tracking-[0.3em] mt-1">MOTAC Verification HUB</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="bg-white p-1 rounded-2xl border border-midnight-navy/5 shadow-sm flex">
                                    <button
                                        onClick={() => setActiveTab('agents')}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'agents' ? 'bg-midnight-navy text-white shadow-lg' : 'text-midnight-navy/40 hover:text-midnight-navy'}`}
                                    >
                                        Agent Accounts {unverifiedProfileCount > 0 && <span className="ml-2 text-brushed-gold">•</span>}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('inquiries')}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'inquiries' ? 'bg-midnight-navy text-white shadow-lg' : 'text-midnight-navy/40 hover:text-midnight-navy'}`}
                                    >
                                        Direct Inquiries {unverifiedInquiryCount > 0 && <span className="ml-2 text-brushed-gold">•</span>}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-midnight-navy/30" />
                                    <input
                                        type="text"
                                        placeholder="Search agents..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-11 pr-6 py-3.5 bg-white border border-midnight-navy/5 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-brushed-gold/20 transition-all w-64 shadow-sm"
                                    />
                                </div>
                            </div>
                        </header>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-20 bg-white rounded-[3rem] border border-midnight-navy/5 shadow-sm space-y-4">
                                    <div className="w-8 h-8 border-2 border-brushed-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-midnight-navy/40">Syncing Secure Data...</span>
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-[3rem] border border-midnight-navy/5 shadow-sm opacity-60">
                                    <ShieldCheck className="w-12 h-12 text-midnight-navy/10 mx-auto mb-4" />
                                    <p className="text-midnight-navy/40 text-sm italic">All agents in this category are up to date.</p>
                                </div>
                            ) : (
                                filteredItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setItemType(activeTab === 'agents' ? 'profile' : 'inquiry');
                                        }}
                                        className={`w-full text-left p-6 rounded-[2.5rem] border transition-all flex items-center justify-between group ${selectedItem?.id === item.id ? 'bg-midnight-navy border-midnight-navy shadow-2xl shadow-midnight-navy/20' : 'bg-white border-midnight-navy/5 hover:border-brushed-gold/50 shadow-sm hover:shadow-md'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif font-bold text-lg relative ${selectedItem?.id === item.id ? 'bg-brushed-gold text-midnight-navy' : 'bg-[#f8f9fa] text-midnight-navy/20'}`}>
                                                {(item.agency_name || item.name || "??").substring(0, 1).toUpperCase()}
                                                {(activeTab === 'agents' ? item.is_verified : item.motac_verified) && (
                                                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-base font-bold ${selectedItem?.id === item.id ? 'text-white' : 'text-midnight-navy'}`}>{item.agency_name || item.name}</span>
                                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-tighter font-mono ${selectedItem?.id === item.id ? 'bg-white/10 text-brushed-gold' : 'bg-midnight-navy/5 text-midnight-navy/60'}`}>
                                                        {item.license_number}
                                                    </span>
                                                </div>
                                                <div className={`flex items-center gap-4 mt-1.5 text-[10px] uppercase tracking-widest font-bold ${selectedItem?.id === item.id ? 'text-white/40' : 'text-midnight-navy/30'}`}>
                                                    <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> {item.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${selectedItem?.id === item.id ? 'text-brushed-gold' : 'text-midnight-navy/10'}`} />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div className="w-[450px] sticky top-10 h-[calc(100vh-80px)]">
                        {selectedItem ? (
                            <div className="bg-white rounded-[3rem] border border-midnight-navy/5 shadow-[0_32px_64px_-16px_rgba(0,26,51,0.1)] h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
                                <div className={`p-10 text-white relative transition-colors duration-500 ${(itemType === 'profile' ? selectedItem.is_verified : selectedItem.motac_verified) ? 'bg-green-600' : 'bg-midnight-navy'}`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-white text-midnight-navy rounded-3xl flex items-center justify-center font-serif font-bold text-2xl shadow-xl shadow-black/20 mb-6">
                                            {(itemType === 'profile' ? selectedItem.is_verified : selectedItem.motac_verified)
                                                ? <UserCheck className="w-8 h-8 text-green-600" />
                                                : <AlertTriangle className="w-8 h-8 text-yellow-600" />
                                            }
                                        </div>
                                        <h2 className="text-2xl font-serif font-bold italic">
                                            {(itemType === 'profile' ? selectedItem.is_verified : selectedItem.motac_verified) ? 'Agent Authorized' : 'Pending Review'}
                                        </h2>
                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                                            {itemType === 'profile' ? 'Persistent Partner Account' : 'Direct Inquiry Lead'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                    <section>
                                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 mb-5 flex items-center gap-2">
                                            <Landmark className="w-3 h-3" /> MOTAC Registration
                                        </h3>
                                        <div className="bg-[#f8f9fa] rounded-[2rem] p-8 space-y-6">
                                            <div className="flex justify-between items-center pb-6 border-b border-midnight-navy/5">
                                                <div>
                                                    <span className="text-[9px] uppercase font-bold tracking-widest text-midnight-navy/40 block mb-1">License No</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl font-bold text-midnight-navy font-mono">{selectedItem.license_number}</span>
                                                        <button onClick={() => navigator.clipboard.writeText(selectedItem.license_number)} className="text-midnight-navy/20 hover:text-midnight-navy transition-colors">
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <a
                                                    href={`https://www.motac.gov.my/en/kategori-semakan-new/travel-agency-tobtab/`}
                                                    target="_blank"
                                                    className="w-full bg-white text-midnight-navy py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-midnight-navy/5 hover:bg-midnight-navy hover:text-white transition-all shadow-sm"
                                                >
                                                    Verify on MOTAC Portal <ExternalLink className="w-3 h-3" />
                                                </a>
                                                <p className="text-[10px] text-midnight-navy/30 leading-relaxed text-center italic">
                                                    Manual verification required via Malaysian Ministry criteria.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 mb-5 flex items-center gap-2">
                                            <Briefcase className="w-3 h-3" /> Contact Info
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-5 bg-[#f8f9fa] rounded-2xl">
                                                <span className="text-[10px] font-bold text-midnight-navy/40 uppercase">Agency</span>
                                                <span className="text-xs font-bold text-midnight-navy">{selectedItem.agency_name || selectedItem.name}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-5 bg-[#f8f9fa] rounded-2xl">
                                                <span className="text-[10px] font-bold text-midnight-navy/40 uppercase">Email</span>
                                                <span className="text-xs font-bold text-midnight-navy">{selectedItem.email}</span>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="p-10 pt-0">
                                    <button
                                        onClick={() => toggleVerification(selectedItem.id, itemType === 'profile' ? selectedItem.is_verified : selectedItem.motac_verified, itemType)}
                                        className={`w-full py-6 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl ${(itemType === 'profile' ? selectedItem.is_verified : selectedItem.motac_verified)
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-red-500/10'
                                            : 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/30'}`}
                                    >
                                        {(itemType === 'profile' ? selectedItem.is_verified : selectedItem.motac_verified) ? (
                                            <>
                                                <XCircle className="w-4 h-4" /> Revoke Partner Access
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" /> Grant Partner Access
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-midnight-navy/5 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center opacity-30">
                                <ShieldCheck className="w-16 h-16 text-midnight-navy mb-6" />
                                <h3 className="text-lg font-serif font-bold mb-2">Integrity Shield</h3>
                                <p className="text-xs leading-relaxed max-w-xs">Select a partner profile or inquiry to manage confidential access tiers and B2B pricing visibility.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </Gatekeeper>
    );
}

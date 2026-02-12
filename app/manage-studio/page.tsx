"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Brochure } from '@/types/brochure';
import {
    Plus,
    Search,
    FileText,
    MessageSquare,
    TrendingUp,
    Calendar,
    Settings,
    LogOut,
    ExternalLink,
    Copy,
    Edit3,
    Trash2,
    Eye,
    XCircle,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import Gatekeeper from '@/components/studio/Gatekeeper';
export default function ManageStudioDashboard() {
    const router = useRouter();
    const [brochures, setBrochures] = useState<Brochure[]>([]);
    const [inquiriesCount, setInquiriesCount] = useState(0);
    const [unverifiedCount, setUnverifiedCount] = useState(0);
    const [archiveCount, setArchiveCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination & Filtering
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [columnFilters, setColumnFilters] = useState({
        title: "",
        category: "all",
        days: "",
        status: "all"
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            // Fetch Brochures
            const { data: bData } = await supabase
                .from('brochures')
                .select('*')
                .neq('is_archived', true)
                .order('created_at', { ascending: false });

            // Fetch Inquiries Count
            const { count: iCount } = await supabase
                .from('inquiries')
                .select('*', { count: 'exact', head: true });

            // Fetch Unverified Count
            const { count: uCount } = await supabase
                .from('inquiries')
                .select('*', { count: 'exact', head: true })
                .eq('motac_verified', false)
                .not('license_number', 'is', null);

            // Fetch Archive Count
            const { count: aCount } = await supabase
                .from('brochures')
                .select('*', { count: 'exact', head: true })
                .eq('is_archived', true);

            if (bData) setBrochures(bData);
            if (iCount !== null) setInquiriesCount(iCount);
            if (uCount !== null) setUnverifiedCount(uCount);
            if (aCount !== null) setArchiveCount(aCount);
        } catch (error) {
            console.error('Error fetching studio data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function archiveBrochure(id: string) {
        if (!confirm("Move this asset to archive? It can be restored later.")) return;
        try {
            const { error } = await supabase
                .from('brochures')
                .update({ is_archived: true })
                .eq('id', id);
            if (error) throw error;
            setBrochures(brochures.filter(b => b.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to archive.');
        }
    }

    async function cloneBrochure(brochure: Brochure) {
        if (!confirm(`Clone "${brochure.title}"?`)) return;

        const newSlug = `${brochure.slug}-clone-${Date.now()}`;

        // Explicitly map ONLY database columns to avoid payload rejection
        const clonedRecord: any = {
            id: newSlug,
            slug: newSlug,
            title: `${brochure.title} (Clone)`,
            category: brochure.category,
            image: brochure.image,
            subtitle: brochure.subtitle,
            summary: brochure.summary,
            city: brochure.city,
            highlights: brochure.highlights,
            itinerary: brochure.itinerary,
            pricing: brochure.pricing,
            tags: brochure.tags,
            inclusions: brochure.inclusions,
            exclusions: brochure.exclusions,
            payment_terms: (brochure as any).payment_terms || (brochure as any).paymentTerms,
            campaign_start: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
            campaign_end: new Date(Date.now() - 86400000).toISOString().split('T')[0],   // 1 day ago (Expired)
            is_archived: false
        };

        try {
            const { data, error } = await supabase
                .from('brochures')
                .insert([clonedRecord])
                .select()
                .single();

            if (error) {
                console.error("Cloning Failed:", error);
                alert(`Cloning Error: ${error.message}`);
                throw error;
            }

            if (data) {
                setBrochures([data, ...brochures]);
                alert("Asset Cloned Successfully!");
            }
        } catch (err) {
            console.error(err);
        }
    }

    const filteredBrochures = useMemo(() => {
        return brochures.filter(b => {
            const matchesGlobal = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.category.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTitle = b.title.toLowerCase().includes(columnFilters.title.toLowerCase());
            const matchesCategory = columnFilters.category === "all" || b.category === columnFilters.category;

            const bDays = Array.isArray(b.itinerary) ? b.itinerary.length : 0;
            const matchesDays = !columnFilters.days || bDays.toString().includes(columnFilters.days);

            const isExpired = b.campaign_end && new Date(b.campaign_end) < new Date();
            const hasCampaign = b.campaign_start || b.campaign_end;
            let currentStatus = "forever";
            if (isExpired) currentStatus = "expired";
            else if (hasCampaign) currentStatus = "active";

            const matchesStatus = columnFilters.status === "all" || currentStatus === columnFilters.status;

            return matchesGlobal && matchesTitle && matchesCategory && matchesDays && matchesStatus;
        });
    }, [brochures, searchQuery, columnFilters]);

    const paginatedBrochures = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBrochures.slice(start, start + itemsPerPage);
    }, [filteredBrochures, currentPage]);

    const totalPages = Math.ceil(filteredBrochures.length / itemsPerPage);

    const handleExit = () => {
        if (confirm("Sign out and exit Studio?")) {
            sessionStorage.removeItem('studio_authorized');
            router.push('/');
        }
    };

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
                            <Link href="/manage-studio" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-brushed-gold">
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
                            <Link href="/manage-studio/archive" className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white group">
                                <div className="flex items-center gap-3">
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm font-medium tracking-wide">Archive</span>
                                </div>
                                {archiveCount > 0 && (
                                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors shadow-sm">
                                        {archiveCount}
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
                <main className="flex-1 ml-64 p-10 bg-[#f8f9fa]">
                    <header className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-midnight-navy italic">Studio Dashboard</h1>
                            <p className="text-midnight-navy/40 text-[10px] uppercase font-bold tracking-[0.3em] mt-1">Global Package Management</p>
                        </div>

                        <Link
                            href="/manage-studio/builder"
                            className="bg-midnight-navy text-white px-8 py-4 rounded-xl flex items-center gap-3 text-xs font-bold tracking-widest uppercase shadow-xl shadow-midnight-navy/20 hover:bg-midnight-navy/90 transition-all hover:-translate-y-1"
                        >
                            <Plus className="w-4 h-4 text-brushed-gold" />
                            Create New Package
                        </Link>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-midnight-navy/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-midnight-navy/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                            <div className="flex items-center gap-4 mb-6 relative">
                                <div className="w-12 h-12 bg-midnight-navy text-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <FileText className="w-6 h-6 text-brushed-gold" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight-navy/40">Total Active Brochure</span>
                            </div>
                            <div className="text-3xl font-serif font-bold text-midnight-navy relative">{brochures.length}</div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-midnight-navy/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brushed-gold/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                            <div className="flex items-center gap-4 mb-6 relative">
                                <div className="w-12 h-12 bg-brushed-gold text-midnight-navy rounded-2xl flex items-center justify-center shadow-lg shadow-brushed-gold/20">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight-navy/40">Agent Inquiries</span>
                            </div>
                            <div className="text-3xl font-serif font-bold text-midnight-navy relative">{inquiriesCount}</div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-midnight-navy/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                            <div className="flex items-center gap-4 mb-6 relative">
                                <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/10">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight-navy/40">Core Status</span>
                            </div>
                            <div className="flex items-center gap-3 relative">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                <span className="text-sm font-bold text-midnight-navy tracking-wide">Studio Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Collections Table */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-midnight-navy/5 overflow-hidden">
                        <div className="p-8 border-b border-midnight-navy/5 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-1 bg-brushed-gold rounded-full"></div>
                                <h2 className="text-xl font-serif font-bold text-midnight-navy">Package Management</h2>
                            </div>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-midnight-navy/30" />
                                <input
                                    type="text"
                                    placeholder="Search by title or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 pr-6 py-3 bg-[#f8f9fa] border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-brushed-gold/20 transition-all w-72 placeholder:text-midnight-navy/20"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy/40">
                                        <th className="px-8 py-5">Brochure Identity</th>
                                        <th className="px-8 py-5">Type</th>
                                        <th className="px-8 py-5">Itinerary</th>
                                        <th className="px-8 py-5">Campaign Period</th>
                                        <th className="px-8 py-5 text-right">Studio Controls</th>
                                    </tr>
                                    <tr className="bg-white border-b border-midnight-navy/5">
                                        <td className="px-8 py-3">
                                            <input
                                                type="text"
                                                placeholder="Filter title..."
                                                value={columnFilters.title}
                                                onChange={(e) => { setColumnFilters({ ...columnFilters, title: e.target.value }); setCurrentPage(1); }}
                                                className="w-full bg-[#f8f9fa] border-none rounded-lg px-3 py-2 text-[10px] font-medium"
                                            />
                                        </td>
                                        <td className="px-8 py-3">
                                            <select
                                                value={columnFilters.category}
                                                onChange={(e) => { setColumnFilters({ ...columnFilters, category: e.target.value }); setCurrentPage(1); }}
                                                className="w-full bg-[#f8f9fa] border-none rounded-lg px-3 py-2 text-[10px] font-bold tracking-widest uppercase"
                                            >
                                                <option value="all">All</option>
                                                <option value="FIT">FIT</option>
                                                <option value="GIT">GIT</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-3">
                                            <input
                                                type="text"
                                                placeholder="Days..."
                                                value={columnFilters.days}
                                                onChange={(e) => { setColumnFilters({ ...columnFilters, days: e.target.value }); setCurrentPage(1); }}
                                                className="w-full bg-[#f8f9fa] border-none rounded-lg px-3 py-2 text-[10px] font-medium"
                                            />
                                        </td>
                                        <td className="px-8 py-3">
                                            <select
                                                value={columnFilters.status}
                                                onChange={(e) => { setColumnFilters({ ...columnFilters, status: e.target.value }); setCurrentPage(1); }}
                                                className="w-full bg-[#f8f9fa] border-none rounded-lg px-3 py-2 text-[10px] font-bold tracking-widest uppercase"
                                            >
                                                <option value="all">All</option>
                                                <option value="active">Active</option>
                                                <option value="forever">Forever</option>
                                                <option value="expired">Expired</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-3 text-right">
                                            <button
                                                onClick={() => setColumnFilters({ title: "", category: "all", days: "", status: "all" })}
                                                className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/30 hover:text-midnight-navy"
                                            >
                                                Reset Filters
                                            </button>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-midnight-navy/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-brushed-gold border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-[10px] uppercase tracking-widest font-bold text-midnight-navy/40">Synchronizing with Core Database...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredBrochures.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-16 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-midnight-navy/40 text-sm italic">No packages found in this search.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedBrochures.map((b) => (
                                            <tr key={b.id} className="hover:bg-[#f8f9fa]/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-midnight-navy group-hover:text-brushed-gold transition-colors">{b.title}</span>
                                                        <span className="text-[10px] text-midnight-navy/30 font-mono mt-0.5 tracking-tighter">STUDIO_ID: {b.slug}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[9px] font-bold px-3 py-1 bg-midnight-navy text-white rounded-full uppercase tracking-widest shadow-sm">
                                                        {b.category}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-midnight-navy/5 rounded-lg flex items-center justify-center text-[10px] font-bold text-midnight-navy">
                                                            {Array.isArray(b.itinerary) ? b.itinerary.length : 0}
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">Days</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        {b.campaign_end && new Date(b.campaign_end) < new Date() ? (
                                                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1">
                                                                <XCircle className="w-3 h-3" /> Expired
                                                            </span>
                                                        ) : b.campaign_start || b.campaign_end ? (
                                                            <span className="text-[9px] font-bold text-midnight-navy/40 uppercase tracking-widest">
                                                                {b.campaign_start ? new Date(b.campaign_start).toLocaleDateString() : '∞'} - {b.campaign_end ? new Date(b.campaign_end).toLocaleDateString() : '∞'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[9px] font-bold text-midnight-navy/20 uppercase tracking-widest">Forever Duration</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                        <Link href={`/brochures/${encodeURIComponent(b.slug)}`} target="_blank" className="p-2.5 hover:bg-white rounded-xl text-midnight-navy/40 hover:text-midnight-navy transition-all shadow-sm hover:shadow-md border border-transparent hover:border-midnight-navy/10" title="Live Preview">
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => cloneBrochure(b)}
                                                            className="p-2.5 hover:bg-white rounded-xl text-midnight-navy/40 hover:text-midnight-navy transition-all shadow-sm hover:shadow-md border border-transparent hover:border-midnight-navy/10" title="Clone Assets"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                        <Link href={`/manage-studio/builder?id=${b.id}`} className="p-2.5 hover:bg-white rounded-xl text-midnight-navy/40 hover:text-midnight-navy transition-all shadow-sm hover:shadow-md border border-transparent hover:border-midnight-navy/10" title="Studio Editor">
                                                            <Edit3 className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => archiveBrochure(b.id)}
                                                            className="p-2.5 hover:bg-white rounded-xl text-midnight-navy/40 hover:text-red-500 transition-all shadow-sm hover:shadow-md border border-transparent hover:border-red-500/10" title="Archive Asset"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="p-8 bg-[#f8f9fa] border-t border-midnight-navy/5 flex items-center justify-between">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/30">
                                    Showing {paginatedBrochures.length} of {filteredBrochures.length} Result{filteredBrochures.length !== 1 ? 's' : ''}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="px-4 py-2 bg-white border border-midnight-navy/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-midnight-navy hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-midnight-navy/30"
                                    >
                                        Prev
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-midnight-navy text-white' : 'hover:bg-midnight-navy/5 text-midnight-navy/40'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="px-4 py-2 bg-white border border-midnight-navy/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-midnight-navy hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-midnight-navy/30"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="p-8 bg-[#f8f9fa] border-t border-midnight-navy/5 text-center">
                            <p className="text-[9px] text-midnight-navy/30 uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-3">
                                <span className="h-px w-12 bg-midnight-navy/10"></span>
                                End of Live Collection Repository
                                <span className="h-px w-12 bg-midnight-navy/10"></span>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </Gatekeeper>
    );
}

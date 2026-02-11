"use client";

import { useEffect, useState } from 'react';
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
    Grid,
    List,
    MapPin,
    Clock,
    Filter,
    XCircle,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import Gatekeeper from '@/components/studio/Gatekeeper';

export default function StudioCollections() {
    const router = useRouter();
    const [brochures, setBrochures] = useState<Brochure[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 3x4 grid or 12 list items

    const handleExit = () => {
        if (confirm("Sign out and exit Studio?")) {
            sessionStorage.removeItem('studio_authorized');
            router.push('/');
        }
    };

    useEffect(() => {
        fetchBrochures();
    }, []);

    async function fetchBrochures() {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('brochures')
                .select('*')
                .neq('is_archived', true)
                .order('created_at', { ascending: false });
            if (data) setBrochures(data);
        } catch (err) {
            console.error('Error fetching brochures:', err);
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
        const cloned = { ...brochure };
        delete (cloned as any).id;
        delete (cloned as any).created_at;
        cloned.title = `${cloned.title} (Clone)`;
        cloned.slug = `${cloned.slug}-clone-${Date.now()}`;
        (cloned as any).id = cloned.slug;

        try {
            const { data, error } = await supabase.from('brochures').insert([cloned]).select().single();
            if (error) throw error;
            if (data) setBrochures([data, ...brochures]);
        } catch (err) {
            console.error(err);
            alert('Failed to clone.');
        }
    }

    const filteredBrochures = brochures.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(b.city) ? b.city.join(' ') : b.city).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedBrochures = filteredBrochures.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredBrochures.length / itemsPerPage);

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
                            <Link href="/manage-studio/brochures" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-brushed-gold">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">Collections</span>
                            </Link>
                            <Link href="/manage-studio/inquiries" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">Inquiries</span>
                            </Link>
                            <Link href="/manage-studio/planner" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">FIT Planner</span>
                            </Link>
                            <Link href="/manage-studio/archive" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white">
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">Archive</span>
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
                    <header className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-midnight-navy italic">Visual Inventory</h1>
                            <p className="text-midnight-navy/40 text-[10px] uppercase font-bold tracking-[0.4em] mt-2">Manage all brochure assets and digital collections</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white p-1 rounded-xl border border-midnight-navy/5 shadow-sm flex">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-midnight-navy text-white shadow-md' : 'text-midnight-navy/30 hover:bg-midnight-navy/5'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-midnight-navy text-white shadow-md' : 'text-midnight-navy/30 hover:bg-midnight-navy/5'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                            <Link
                                href="/manage-studio/builder"
                                className="bg-midnight-navy text-white px-8 py-3.5 rounded-xl flex items-center gap-3 text-xs font-bold tracking-widest uppercase shadow-xl shadow-midnight-navy/20 hover:bg-midnight-navy/90 transition-all hover:-translate-y-1"
                            >
                                <Plus className="w-4 h-4 text-brushed-gold" />
                                Create Asset
                            </Link>
                        </div>
                    </header>

                    {/* Filters & Search Toolbar */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-midnight-navy/5 mb-10 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-midnight-navy/30" />
                                <input
                                    type="text"
                                    placeholder="Search by identity, city or category..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="pl-11 pr-6 py-3 bg-[#f8f9fa] border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-brushed-gold/20 transition-all w-80 placeholder:text-midnight-navy/20"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 hover:text-midnight-navy transition-colors">
                                    <Filter className="w-3.5 h-3.5" />
                                    Categories
                                </button>
                                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 hover:text-midnight-navy transition-colors">
                                    <MapPin className="w-3.5 h-3.5" />
                                    Regions
                                </button>
                            </div>
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-midnight-navy/30">
                            Showing {filteredBrochures.length} of {brochures.length} Active Brochures
                        </div>
                    </div>

                    {/* Visual Grid */}
                    {loading ? (
                        <div className="py-32 text-center">
                            <div className="w-8 h-8 border-2 border-brushed-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-midnight-navy/40">Loading Core Assets...</span>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
                            {paginatedBrochures.map((b) => (
                                viewMode === 'grid' ? (
                                    <div key={b.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-midnight-navy/5 shadow-sm hover:shadow-2xl transition-all group">
                                        <div className="h-56 relative overflow-hidden">
                                            <img
                                                src={b.image}
                                                alt={b.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                            <div className="absolute top-6 right-6">
                                                <span className="px-3 py-1 bg-white text-midnight-navy text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                                    {b.category}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-6 left-6 text-white">
                                                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
                                                    <MapPin className="w-3 h-3 text-brushed-gold" />
                                                    {Array.isArray(b.city) ? b.city[0] : b.city}
                                                </div>
                                                <h3 className="text-lg font-serif font-bold italic">{b.title}</h3>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-midnight-navy/5">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-midnight-navy/30" />
                                                    <span className="text-xs font-bold text-midnight-navy">{Array.isArray(b.itinerary) ? b.itinerary.length : 0} Days</span>
                                                </div>
                                                <div className="text-right">
                                                    {b.campaign_end && new Date(b.campaign_end) < new Date() ? (
                                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                                                            <XCircle className="w-3 h-3" /> Expired
                                                        </span>
                                                    ) : b.campaign_start || b.campaign_end ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-brushed-gold block mb-0.5">Campaign Active</span>
                                                            <span className="text-[9px] font-medium text-midnight-navy/40 uppercase">{b.campaign_end ? `Ends ${new Date(b.campaign_end).toLocaleDateString()}` : 'No expiry'}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-right">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/30 block mb-0.5">Duration</span>
                                                            <span className="text-[10px] font-bold text-midnight-navy/20 uppercase">Forever Offer</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link href={`/brochures/${encodeURIComponent(b.slug)}`} target="_blank" className="p-3 bg-midnight-navy/5 text-midnight-navy rounded-xl hover:bg-midnight-navy hover:text-white transition-all flex items-center justify-center" title="Live Preview">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link href={`/manage-studio/builder?id=${b.id}`} className="flex-1 bg-midnight-navy text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-midnight-navy/90 transition-all flex items-center justify-center gap-2">
                                                    <Edit3 className="w-3.5 h-3.5 text-brushed-gold" />
                                                    Edit Asset
                                                </Link>
                                                <button
                                                    onClick={() => cloneBrochure(b)}
                                                    className="p-3 bg-midnight-navy/5 text-midnight-navy rounded-xl hover:bg-midnight-navy hover:text-white transition-all"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => archiveBrochure(b.id)}
                                                    className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={b.id} className="bg-white p-6 rounded-[2rem] border border-midnight-navy/5 shadow-sm hover:shadow-md transition-all flex items-center gap-8 group">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                                            <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-serif font-bold text-midnight-navy">{b.title}</h3>
                                                <span className="px-2 py-0.5 bg-midnight-navy/5 text-midnight-navy text-[8px] font-bold uppercase tracking-widest rounded">
                                                    {b.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">
                                                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {Array.isArray(b.city) ? b.city.join(', ') : b.city}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {Array.isArray(b.itinerary) ? b.itinerary.length : 0} Days Itinerary</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <Link href={`/${b.slug}`} target="_blank" className="p-3 bg-[#f8f9fa] text-midnight-navy rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-midnight-navy/5" title="View Preview">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/manage-studio/builder?id=${b.id}`} className="p-3 bg-[#f8f9fa] text-midnight-navy rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-midnight-navy/5" title="Studio Editor">
                                                <Edit3 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => cloneBrochure(b)}
                                                className="p-3 bg-[#f8f9fa] text-midnight-navy rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-midnight-navy/5" title="Clone Asset"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => archiveBrochure(b.id)}
                                                className="p-3 bg-red-50 text-red-300 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Archive Record"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="px-6 py-3 bg-white border border-midnight-navy/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-midnight-navy hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-midnight-navy/30 shadow-sm"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-midnight-navy text-white shadow-lg shadow-midnight-navy/20' : 'bg-white border border-midnight-navy/5 text-midnight-navy/40 hover:bg-midnight-navy hover:text-white shadow-sm'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="px-6 py-3 bg-white border border-midnight-navy/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-midnight-navy hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-midnight-navy/30 shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </Gatekeeper>
    );
}

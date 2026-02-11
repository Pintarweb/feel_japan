"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
    MessageSquare,
    Search,
    Calendar,
    User,
    Mail,
    Phone,
    Globe,
    ChevronRight,
    ArrowLeft,
    TrendingUp,
    FileText,
    LogOut,
    ExternalLink,
    Filter,
    CheckCircle2,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import Gatekeeper from '@/components/studio/Gatekeeper';

interface Inquiry {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    travel_from: string;
    travel_to: string;
    adults: number;
    children_6_11: number;
    infants_under_6: number;
    budget: string;
    places_of_visit: string;
    room_category: string;
    pax: number;
}

export default function StudioInquiries() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [archiveCount, setArchiveCount] = useState(0);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    const handleExit = () => {
        if (confirm("Sign out and exit Studio?")) {
            sessionStorage.removeItem('studio_authorized');
            router.push('/');
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    async function fetchInquiries() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setInquiries(data);

            // Fetch Archive Count
            const { count: aCount } = await supabase
                .from('brochures')
                .select('*', { count: 'exact', head: true })
                .eq('is_archived', true);
            if (aCount !== null) setArchiveCount(aCount);
        } catch (err) {
            console.error('Error fetching inquiries:', err);
        } finally {
            setLoading(false);
        }
    }

    const filteredInquiries = inquiries.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.country.toLowerCase().includes(searchQuery.toLowerCase())
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
                                <span className="text-sm font-medium tracking-wide">Collections</span>
                            </Link>
                            <Link href="/manage-studio/inquiries" className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-xl text-brushed-gold group">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-sm font-medium tracking-wide">Inquiries</span>
                                </div>
                                {inquiries.length > 0 && (
                                    <span className="bg-brushed-gold text-midnight-navy text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md border border-white/20">
                                        {inquiries.length}
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
                <main className="flex-1 ml-64 p-10 flex gap-10">
                    {/* Inquiry List */}
                    <div className="flex-1 space-y-8">
                        <header className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-midnight-navy italic">Agent Inquiries</h1>
                                <p className="text-midnight-navy/40 text-[10px] uppercase font-bold tracking-[0.3em] mt-1">Live Lead Management</p>
                            </div>

                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-midnight-navy/30" />
                                <input
                                    type="text"
                                    placeholder="Find agent or country..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 pr-6 py-3 bg-white border border-midnight-navy/5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brushed-gold/20 transition-all w-72 shadow-sm"
                                />
                            </div>
                        </header>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-20 bg-white rounded-[2rem] border border-midnight-navy/5 shadow-sm">
                                    <div className="w-6 h-6 border-2 border-brushed-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-midnight-navy/40">Fetching Lead Assets...</span>
                                </div>
                            ) : filteredInquiries.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-[2rem] border border-midnight-navy/5 shadow-sm">
                                    <span className="text-midnight-navy/40 text-sm italic">No inquiries available.</span>
                                </div>
                            ) : (
                                filteredInquiries.map((inquiry) => (
                                    <button
                                        key={inquiry.id}
                                        onClick={() => setSelectedInquiry(inquiry)}
                                        className={`w-full text-left p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${selectedInquiry?.id === inquiry.id ? 'bg-midnight-navy border-midnight-navy shadow-xl shadow-midnight-navy/20' : 'bg-white border-midnight-navy/5 hover:border-brushed-gold shadow-sm hover:shadow-md'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs ${selectedInquiry?.id === inquiry.id ? 'bg-brushed-gold text-midnight-navy' : 'bg-midnight-navy/5 text-midnight-navy'}`}>
                                                {inquiry.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-sm font-bold ${selectedInquiry?.id === inquiry.id ? 'text-white' : 'text-midnight-navy'}`}>{inquiry.name}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter ${selectedInquiry?.id === inquiry.id ? 'bg-white/10 text-white/60' : 'bg-midnight-navy/5 text-midnight-navy/40'}`}>
                                                        {inquiry.country}
                                                    </span>
                                                </div>
                                                <div className={`flex items-center gap-4 mt-1 text-[10px] uppercase tracking-widest font-bold ${selectedInquiry?.id === inquiry.id ? 'text-white/40' : 'text-midnight-navy/30'}`}>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(inquiry.created_at).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {inquiry.pax} PAX</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${selectedInquiry?.id === inquiry.id ? 'text-brushed-gold' : 'text-midnight-navy/20'}`} />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Inquiry Details Panel */}
                    <div className="w-[450px] sticky top-10 h-[calc(100vh-80px)]">
                        {selectedInquiry ? (
                            <div className="bg-white rounded-[2.5rem] border border-midnight-navy/5 shadow-2xl h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="p-10 bg-midnight-navy text-white relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brushed-gold/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-brushed-gold text-midnight-navy rounded-3xl flex items-center justify-center font-serif font-bold text-2xl shadow-xl shadow-black/20 mb-6">
                                            {selectedInquiry.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <h2 className="text-2xl font-serif font-bold italic">{selectedInquiry.name}</h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-brushed-gold text-[10px] font-bold uppercase tracking-widest">{selectedInquiry.country} Specialist Agent</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                                    <section>
                                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 mb-4 flex items-center gap-2">
                                            <Mail className="w-3 h-3" /> Communication Assets
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="bg-[#f8f9fa] p-4 rounded-2xl flex items-center gap-4 border border-midnight-navy/5">
                                                <Mail className="w-4 h-4 text-midnight-navy/30" />
                                                <span className="text-sm font-medium">{selectedInquiry.email}</span>
                                            </div>
                                            <div className="bg-[#f8f9fa] p-4 rounded-2xl flex items-center gap-4 border border-midnight-navy/5">
                                                <Phone className="w-4 h-4 text-midnight-navy/30" />
                                                <span className="text-sm font-medium">{selectedInquiry.phone}</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 mb-4 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> Travel Architecture
                                        </h3>
                                        <div className="bg-white border border-midnight-navy/5 rounded-[2rem] p-6 shadow-sm space-y-6">
                                            <div className="flex justify-between items-center pb-6 border-b border-midnight-navy/5">
                                                <div>
                                                    <span className="text-[9px] uppercase font-bold tracking-widest text-midnight-navy/40 block">Travel Period</span>
                                                    <span className="text-sm font-bold text-midnight-navy">
                                                        {new Date(selectedInquiry.travel_from).toLocaleDateString()} - {new Date(selectedInquiry.travel_to).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[9px] uppercase font-bold tracking-widest text-midnight-navy/40 block">Total Pax</span>
                                                    <span className="text-sm font-bold text-midnight-navy">{selectedInquiry.pax} Participants</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <span className="text-[9px] uppercase font-bold tracking-widest text-midnight-navy/40 block mb-1">Budget</span>
                                                    <span className="text-xs font-bold text-midnight-navy px-3 py-1 bg-green-500/10 text-green-700 rounded-lg">{selectedInquiry.budget}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[9px] uppercase font-bold tracking-widest text-midnight-navy/40 block mb-1">Room Class</span>
                                                    <span className="text-xs font-bold text-midnight-navy px-3 py-1 bg-midnight-navy/5 rounded-lg">{selectedInquiry.room_category}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[9px] uppercase font-bold tracking-widest text-midnight-navy/40 block mb-2">Places of Visit</span>
                                                <p className="text-sm leading-relaxed text-midnight-navy/70 italic font-serif">
                                                    "{selectedInquiry.places_of_visit}"
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="pt-6">
                                        <button className="w-full bg-midnight-navy text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-midnight-navy/20 hover:bg-midnight-navy/90 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-brushed-gold" />
                                            Mark as Responded
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-midnight-navy/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center opacity-40">
                                <div className="w-16 h-16 bg-midnight-navy/5 rounded-3xl flex items-center justify-center mb-6">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-serif font-bold mb-2">Lead Inspect</h3>
                                <p className="text-xs leading-relaxed">Select an inquiry from the live feed to inspect asset details and travel architecture.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </Gatekeeper>
    );
}

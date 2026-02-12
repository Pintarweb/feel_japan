"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
    MessageSquare,
    Search,
    TrendingUp,
    FileText,
    LogOut,
    ExternalLink,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Copy,
    Trash2,
    Calendar,
    ChevronRight,
    AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import Gatekeeper from '@/components/studio/Gatekeeper';

interface Inquiry {
    id: string;
    created_at: string;
    agency_name: string;
    name: string;
    email: string;
    phone: string;
    license_number: string;
    motac_verified: boolean;
    adults: number;
    children_6_11: number;
    infants_under_6: number;
    estimated_budget: string;
    places_of_visit: string;
    room_category: string;
    package_slug: string;
    travel_dates: string;
    pax: number;
}

export default function StudioVerification() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [archiveCount, setArchiveCount] = useState(0);
    const [inquiriesCount, setInquiriesCount] = useState(0);
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
                .not('license_number', 'is', null) // Only fetch inquiries with license number
                .order('created_at', { ascending: false });

            if (data) setInquiries(data);

            // Fetch General Inquiries Count for sidebar
            const { count: iCount } = await supabase
                .from('inquiries')
                .select('*', { count: 'exact', head: true });
            if (iCount !== null) setInquiriesCount(iCount);

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

    async function toggleVerification(id: string, currentStatus: boolean) {
        // If currently verified, we are un-verifying. If not, we are verifying.
        const newStatus = !currentStatus;
        const action = newStatus ? "VERIFY" : "REVOKE";

        if (!confirm(`Are you sure you want to ${action} this agent license?`)) return;

        try {
            const { error } = await supabase
                .from('inquiries')
                .update({ motac_verified: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setInquiries(inquiries.map(i => i.id === id ? { ...i, motac_verified: newStatus } : i));
            if (selectedInquiry?.id === id) {
                setSelectedInquiry({ ...selectedInquiry, motac_verified: newStatus });
            }
        } catch (err) {
            console.error('Error updating verification:', err);
            alert('Failed to update verification status.');
        }
    }

    const filteredInquiries = inquiries.filter(i => {
        const query = searchQuery.toLowerCase();
        return (
            (i.name?.toLowerCase().includes(query) ?? false) ||
            (i.license_number?.toLowerCase().includes(query) ?? false) ||
            (i.agency_name?.toLowerCase().includes(query) ?? false)
        );
    });

    const unverifiedCount = inquiries.filter(i => !i.motac_verified).length;

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
                            <Link href="/manage-studio/inquiries" className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white group">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-sm font-medium tracking-wide">Inquiries</span>
                                </div>
                                {inquiriesCount > 0 && (
                                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg group-hover:bg-brushed-gold group-hover:text-midnight-navy transition-colors shadow-sm border border-white/20">
                                        {inquiriesCount}
                                    </span>
                                )}
                            </Link>
                            <Link href="/manage-studio/verify" className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-xl text-brushed-gold group">
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
                <main className="flex-1 ml-64 p-10 flex gap-10">
                    {/* Inquiry List */}
                    <div className="flex-1 space-y-8">
                        <header className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-midnight-navy italic">Agent Licensing</h1>
                                <p className="text-midnight-navy/40 text-[10px] uppercase font-bold tracking-[0.3em] mt-1">MOTAC Verification Portal</p>
                            </div>

                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-midnight-navy/30" />
                                <input
                                    type="text"
                                    placeholder="Find agency or license no..."
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
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-midnight-navy/40">Syncing License Data...</span>
                                </div>
                            ) : filteredInquiries.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-[2rem] border border-midnight-navy/5 shadow-sm">
                                    <span className="text-midnight-navy/40 text-sm italic">No unverified agents found.</span>
                                </div>
                            ) : (
                                filteredInquiries.map((inquiry) => (
                                    <button
                                        key={inquiry.id}
                                        onClick={() => setSelectedInquiry(inquiry)}
                                        className={`w-full text-left p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${selectedInquiry?.id === inquiry.id ? 'bg-midnight-navy border-midnight-navy shadow-xl shadow-midnight-navy/20' : 'bg-white border-midnight-navy/5 hover:border-brushed-gold shadow-sm hover:shadow-md'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs relative ${selectedInquiry?.id === inquiry.id ? 'bg-brushed-gold text-midnight-navy' : 'bg-midnight-navy/5 text-midnight-navy'}`}>
                                                {(inquiry.name || inquiry.agency_name || "??").substring(0, 2).toUpperCase()}
                                                {inquiry.motac_verified && (
                                                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-sm font-bold ${selectedInquiry?.id === inquiry.id ? 'text-white' : 'text-midnight-navy'}`}>{inquiry.agency_name}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter ${inquiry.motac_verified
                                                        ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'}`}>
                                                        {inquiry.license_number}
                                                    </span>
                                                </div>
                                                <div className={`flex items-center gap-4 mt-1 text-[10px] uppercase tracking-widest font-bold ${selectedInquiry?.id === inquiry.id ? 'text-white/40' : 'text-midnight-navy/30'}`}>
                                                    <span className="flex items-center gap-1">Status: {inquiry.motac_verified ? 'Verified' : 'Pending Verification'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${selectedInquiry?.id === inquiry.id ? 'text-brushed-gold' : 'text-midnight-navy/20'}`} />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Verification Details Panel */}
                    <div className="w-[450px] sticky top-10 h-[calc(100vh-80px)]">
                        {selectedInquiry ? (
                            <div className="bg-white rounded-[2.5rem] border border-midnight-navy/5 shadow-2xl h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className={`p-10 text-white relative transition-colors duration-500 ${selectedInquiry.motac_verified ? 'bg-green-600' : 'bg-midnight-navy'}`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-white text-midnight-navy rounded-3xl flex items-center justify-center font-serif font-bold text-2xl shadow-xl shadow-black/20 mb-6">
                                            {selectedInquiry.motac_verified
                                                ? <CheckCircle2 className="w-8 h-8 text-green-600" />
                                                : <AlertTriangle className="w-8 h-8 text-yellow-600" />
                                            }
                                        </div>
                                        <h2 className="text-2xl font-serif font-bold italic">
                                            {selectedInquiry.motac_verified ? 'License Verified' : 'Action Required'}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                                {selectedInquiry.motac_verified ? 'Agent is authorized' : 'Verify with MOTAC'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                                    <section>
                                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 mb-4 flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3" /> License Details
                                        </h3>
                                        <div className="bg-[#f8f9fa] border border-midnight-navy/5 rounded-[2rem] p-6 shadow-sm space-y-6">
                                            <div className="flex justify-between items-center pb-6 border-b border-midnight-navy/5">
                                                <div>
                                                    <span className="text-[9px] uppercase font-bold tracking-widest text-midnight-navy/40 block">License Number</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-midnight-navy font-mono">
                                                            {selectedInquiry.license_number}
                                                        </span>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(selectedInquiry.license_number)}
                                                            className="text-midnight-navy/30 hover:text-midnight-navy transition-colors"
                                                            title="Copy License No"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[9px] uppercase font-bold tracking-widest text-midnight-navy/40 block mb-2">Verification Action</span>
                                                <a
                                                    href="https://www.motac.gov.my/en/kategori-semakan-new/travel-agency-tobtab/"
                                                    target="_blank"
                                                    className="w-full bg-[#E8F0FE] text-[#1967D2] py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D2E3FC] transition-colors"
                                                >
                                                    Open MOTAC Portal <ExternalLink className="w-3 h-3" />
                                                </a>
                                                <p className="text-[10px] text-midnight-navy/40 mt-3 leading-relaxed text-center">
                                                    External link to Ministry of Tourism, Arts and Culture Malaysia
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 mb-4 flex items-center gap-2">
                                            <FileText className="w-3 h-3" /> Agency Profile
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex justify-between items-center p-4 bg-white border border-midnight-navy/5 rounded-2xl">
                                                <span className="text-xs font-bold text-midnight-navy/50">Agency Name</span>
                                                <span className="text-sm font-bold text-midnight-navy">{selectedInquiry.agency_name}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-white border border-midnight-navy/5 rounded-2xl">
                                                <span className="text-xs font-bold text-midnight-navy/50">Contact Person</span>
                                                <span className="text-sm font-bold text-midnight-navy">{selectedInquiry.name}</span>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="pt-6">
                                        <button
                                            onClick={() => toggleVerification(selectedInquiry.id, selectedInquiry.motac_verified)}
                                            className={`w-full py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${selectedInquiry.motac_verified
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-red-500/10'
                                                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/30'
                                                }`}
                                        >
                                            {selectedInquiry.motac_verified ? (
                                                <>
                                                    <XCircle className="w-4 h-4" />
                                                    Revoke Verification
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Confirm Valid License
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-midnight-navy/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center opacity-40">
                                <div className="w-16 h-16 bg-midnight-navy/5 rounded-3xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-serif font-bold mb-2">License Verification</h3>
                                <p className="text-xs leading-relaxed">Select an agent inquiry to verify their MOTAC license credentials.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </Gatekeeper>
    );
}

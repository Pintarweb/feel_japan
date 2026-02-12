"use client";

export const dynamic = 'force-dynamic';

import {
    Calendar,
    TrendingUp,
    FileText,
    MessageSquare,
    ExternalLink,
    Clock,
    Sparkles,
    Layout,
    Layers,
    Trash2,
    LogOut,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Gatekeeper from '@/components/studio/Gatekeeper';

export default function FITPlanner() {
    const router = useRouter();

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
                            <Link href="/manage-studio" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">Dashboard</span>
                            </Link>
                            <Link href="/manage-studio/brochures" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">Collections</span>
                            </Link>
                            <Link href="/manage-studio/inquiries" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">Inquiries</span>
                            </Link>
                            <Link href="/manage-studio/verify" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-white">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wide">Agent Verification</span>
                            </Link>
                            <Link href="/manage-studio/planner" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-brushed-gold">
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
                <main className="flex-1 ml-64 p-10 bg-[#f8f9fa] flex items-center justify-center">
                    <div className="max-w-2xl w-full text-center space-y-10">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 bg-midnight-navy text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl relative z-10">
                                <Sparkles className="w-12 h-12 text-brushed-gold" />
                            </div>
                            <div className="absolute inset-0 bg-brushed-gold/20 rounded-[2.5rem] blur-2xl -z-0 scale-110"></div>
                        </div>

                        <div>
                            <h1 className="text-5xl font-serif font-bold italic mb-4">The Intelligent FIT Planner</h1>
                            <p className="text-midnight-navy/40 text-[10px] uppercase font-bold tracking-[0.5em]">Phase II: Narrative Itinerary Creation</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 text-left">
                            <div className="bg-white p-8 rounded-[2rem] border border-midnight-navy/5 shadow-sm space-y-4">
                                <Layout className="w-6 h-6 text-brushed-gold" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Mix & Match Architecture</h3>
                                <p className="text-xs text-midnight-navy/60 leading-relaxed font-serif italic">
                                    Pull blocks from heritage collections to build unique, one-off specialized departures in seconds.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-[2rem] border border-midnight-navy/5 shadow-sm space-y-4">
                                <Layers className="w-6 h-6 text-midnight-navy" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Dynamic Logic Filters</h3>
                                <p className="text-xs text-midnight-navy/60 leading-relaxed font-serif italic">
                                    Intelligent suggestions based on regional proximity, travel seasonal logic, and agent preferences.
                                </p>
                            </div>
                        </div>

                        <div className="pt-8">
                            <div className="flex items-center justify-center gap-3 text-[10px] uppercase font-bold tracking-widest text-midnight-navy/40">
                                <Clock className="w-4 h-4" />
                                Studio Development in Progress
                            </div>
                            <div className="w-48 h-1 bg-midnight-navy/5 rounded-full mx-auto mt-4 overflow-hidden">
                                <div className="w-2/3 h-full bg-brushed-gold rounded-full"></div>
                            </div>
                        </div>

                        <Link href="/manage-studio" className="inline-block text-xs font-bold uppercase tracking-widest text-midnight-navy hover:text-midnight-navy/60 transition-colors border-b-2 border-midnight-navy/10 pb-1">
                            Return to Command Center
                        </Link>
                    </div>
                </main>
            </div>
        </Gatekeeper>
    );
}

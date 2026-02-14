"use client";

import Link from 'next/link';
import { useState } from 'react';
import { X, User, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';

interface NavbarProps { }

export default function Navbar({ }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);

    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    return (
        <>
            <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-2 bg-white/95 backdrop-blur-md border-b border-midnight-navy/5 h-20 md:h-24">
                {/* Mobile: Hamburger / Desktop: Hidden */}
                <div className="flex items-center gap-2 md:hidden">
                    <button onClick={() => setIsMenuOpen(true)} className="p-1 group">
                        <span className="block w-6 h-0.5 bg-midnight-navy mb-1.5 rounded-full transition-all group-hover:bg-brushed-gold"></span>
                        <span className="block w-6 h-0.5 bg-midnight-navy mb-1.5 rounded-full transition-all group-hover:bg-brushed-gold"></span>
                        <span className="block w-4 h-0.5 bg-midnight-navy rounded-full transition-all group-hover:bg-brushed-gold group-hover:w-6"></span>
                    </button>
                </div>

                {/* Logo Section */}
                <div className="flex items-center gap-6 h-full">
                    <Link href="/" className="flex items-center gap-4 h-full group">
                        <img
                            src="/logo_transparent.png"
                            alt="Feel Japan with K"
                            className="h-[120%] md:h-[135%] w-auto object-contain transition-transform group-hover:scale-105 mt-2"
                        />
                        <div className="flex flex-col border-l border-midnight-navy/10 pl-4 py-1">
                            <span className="text-lg md:text-xl font-serif font-bold tracking-tight text-midnight-navy">Feel Japan with K</span>
                            <div className="flex items-center gap-3 opacity-60">
                                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-none whitespace-nowrap">An affiliated company of</span>
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/arkalliance_transparent_logo.png"
                                        alt="Ark Alliance"
                                        className="h-9 md:h-10 w-auto object-contain"
                                    />
                                    <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-midnight-navy">Ark Alliance</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <Link href="/" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/85 hover:text-midnight-navy transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/85 hover:text-midnight-navy transition-colors">
                        About Us
                    </Link>
                    <Link href="/#collections" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/85 hover:text-midnight-navy transition-colors">
                        Portfolio
                    </Link>
                    <Link href="/bulletin" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/85 hover:text-midnight-navy transition-colors">
                        Bulletin
                    </Link>
                    <Link href="/review" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/85 hover:text-midnight-navy transition-colors">
                        Review
                    </Link>
                    <Link href="/contact" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/85 hover:text-midnight-navy transition-colors">
                        Contact
                    </Link>
                </div>

                {/* Partner Identity & CTA */}
                <div className="flex items-center gap-6">
                    {loading ? (
                        <Loader2 className="w-3 h-3 animate-spin text-midnight-navy/20" />
                    ) : (
                        <div className="flex items-center space-x-8">
                            {user ? (
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-bold text-brushed-gold uppercase tracking-[0.2em] mb-0.5 leading-none">Partner Account</span>
                                        <span className="text-[11px] font-bold text-midnight-navy/85 uppercase tracking-widest">{user.email?.split('@')[0]}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-[10px] font-bold text-red-500/85 uppercase tracking-widest hover:text-red-500 transition-all border border-red-500/10 hover:border-red-500/30 px-4 py-2 rounded-full"
                                    >
                                        <LogOut className="w-3 h-3" />
                                        Logout
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[60] bg-midnight-navy/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="flex justify-end p-6">
                    <button onClick={() => setIsMenuOpen(false)} className="p-2 text-off-white hover:text-brushed-gold transition-colors">
                        <X size={32} />
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center h-[80vh] space-y-8">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-off-white hover:text-brushed-gold transition-colors">
                        Home
                    </Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-off-white hover:text-brushed-gold transition-colors">
                        About Us
                    </Link>
                    <Link href="/#collections" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-off-white hover:text-brushed-gold transition-colors">
                        Portfolio
                    </Link>
                    <Link href="/bulletin" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-off-white hover:text-brushed-gold transition-colors">
                        Bulletin
                    </Link>
                    <Link href="/review" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-off-white hover:text-brushed-gold transition-colors">
                        Review
                    </Link>
                    <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-off-white hover:text-brushed-gold transition-colors">
                        Contact
                    </Link>

                    <div className="flex flex-col gap-6 pt-12 items-center">
                        {!user ? null : (
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-brushed-gold uppercase tracking-[0.4em]">Partner Account</span>
                                <span className="text-xl font-serif text-off-white italic">{user.email}</span>
                                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-red-500/85 hover:text-red-500 transition-colors mt-4">
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

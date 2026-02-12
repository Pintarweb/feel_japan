"use client";

import Link from 'next/link';
import { useState } from 'react';
import { X } from 'lucide-react';

interface NavbarProps {
    hideInquiry?: boolean;
}

export default function Navbar({ hideInquiry = false }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

                {/* Logo */}
                <Link href="/" className="flex items-center justify-center h-full">
                    <img
                        src="/logo_transparent.png"
                        alt="Feel Japan with K"
                        className="h-[140%] w-auto object-contain mt-2"
                    />
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <Link href="/" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/60 hover:text-midnight-navy transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/60 hover:text-midnight-navy transition-colors">
                        About Us
                    </Link>
                    <Link href="/#collections" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/60 hover:text-midnight-navy transition-colors">
                        Portfolio
                    </Link>
                    <Link href="/bulletin" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/60 hover:text-midnight-navy transition-colors">
                        Bulletin
                    </Link>
                    <Link href="/reviews" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/60 hover:text-midnight-navy transition-colors">
                        Review
                    </Link>
                    <Link href="/contact" className="text-xs font-bold tracking-widest uppercase text-midnight-navy/60 hover:text-midnight-navy transition-colors">
                        Contact
                    </Link>
                </div>

                {/* Inquiry CTA */}
                {!hideInquiry && (
                    <div className="flex items-center">
                        <Link href="/inquire" className="text-xs font-bold tracking-widest uppercase text-brushed-gold hover:text-midnight-navy transition-colors">
                            Inquiry
                        </Link>
                    </div>
                )}
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
                    <Link href="/reviews" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-off-white hover:text-brushed-gold transition-colors">
                        Review
                    </Link>
                    <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-off-white hover:text-brushed-gold transition-colors">
                        Contact
                    </Link>
                    {!hideInquiry && (
                        <Link href="/inquire" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-off-white hover:text-brushed-gold transition-colors">
                            Inquiry
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

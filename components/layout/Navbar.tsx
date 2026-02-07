import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 bg-off-white/90 backdrop-blur-md border-b border-midnight-navy/5">
            <div className="flex items-center gap-2">
                <button className="p-1">
                    <span className="material-symbols-outlined text-midnight-navy block w-6 h-0.5 bg-midnight-navy mb-1.5 rounded-full"></span>
                    <span className="material-symbols-outlined text-midnight-navy block w-6 h-0.5 bg-midnight-navy mb-1.5 rounded-full"></span>
                    <span className="material-symbols-outlined text-midnight-navy block w-4 h-0.5 bg-midnight-navy rounded-full"></span>
                </button>
            </div>

            {/* Logo - Centered on Mobile, Left on Desktop */}
            <Link href="/" className="text-lg font-serif font-bold tracking-tight text-midnight-navy md:text-xl">
                Feel Japan with K
            </Link>

            <div className="flex items-center">
                <Link href="/inquire" className="text-xs font-bold tracking-widest uppercase text-brushed-gold hover:text-midnight-navy transition-colors">
                    Inquiry
                </Link>
            </div>
        </nav>
    );
}

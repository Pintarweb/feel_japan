import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-midnight-navy text-white py-4 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Brand & Quote */}
                <div className="flex flex-row items-center gap-4 md:max-w-md">
                    <div className="bg-white p-1.5 rounded-lg shadow-lg flex-shrink-0">
                        {/* Tight crop, bigger logo */}
                        <img
                            src="/logo_transparent.png"
                            alt="Feel Japan with K"
                            className="h-20 w-auto object-contain"
                        />
                    </div>
                    <p className="text-white/60 text-xs leading-tight font-serif italic text-left">
                        "Bringing the beauty of Japan to your heart through Halal-friendly travel."
                    </p>
                </div>

                {/* Contact Info */}
                <div className="flex flex-row gap-8 md:gap-12 text-left">

                    {/* Address */}
                    <div>
                        <p className="text-[10px] font-bold text-brushed-gold uppercase tracking-[0.2em] mb-1">KL Headquarters</p>
                        <address className="text-[10px] text-white/80 leading-tight not-italic font-light">
                            E-8-6, Block E, Megan Avenue 1,<br />
                            189, Jalan Tun Razak,<br />
                            50400 Kuala Lumpur
                        </address>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-[10px] font-bold text-brushed-gold uppercase tracking-[0.2em] mb-1">Contact Specialist</p>
                        <div className="flex items-center justify-start gap-3 mb-1">
                            <span className="font-serif text-lg tracking-wide text-white">03-7494 6048</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-2">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
                    &copy; 2026 Feel Japan with K. Travel & Tours.
                </p>
                <div className="flex gap-6">
                    <Link href="/manage-studio" className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1.5 border-r border-white/10 pr-6">Studio Portal</Link>
                    <Link href="/privacy" className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}

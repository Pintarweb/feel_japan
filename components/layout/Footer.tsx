import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-midnight-navy text-white py-4 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Brand & Quote */}
                <div className="flex flex-row items-center gap-6 md:max-w-xl">
                    <div className="bg-white p-2 rounded-xl border border-white/10 shadow-lg flex-shrink-0">
                        <img
                            src="/logo_transparent.png"
                            alt="Feel Japan with K"
                            className="h-16 w-auto object-contain"
                        />
                    </div>
                    <div>
                        <h4 className="text-lg font-serif font-bold text-white mb-1">Feel Japan with K</h4>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">An Ark Alliance Affiliated Company</p>
                        <p className="text-white/60 text-xs leading-tight font-serif italic max-w-xs">
                            "Bringing the beauty of Japan to your heart through Halal-friendly travel."
                        </p>
                    </div>
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
                        <p className="text-[10px] font-bold text-brushed-gold uppercase tracking-[0.2em] mb-4">Contact Specialist</p>
                        <div className="flex flex-col items-start gap-4">
                            <div className="flex flex-col gap-3">
                                <a href="tel:+60137023981" className="flex items-center gap-3 group/item">
                                    <Phone className="w-3.5 h-3.5 text-brushed-gold shrink-0 transition-transform group-hover/item:scale-110" />
                                    <span className="font-serif text-sm tracking-wide text-white group-hover/item:text-brushed-gold transition-colors">013-702 3981</span>
                                </a>
                                <a href="tel:+60196556243" className="flex items-center gap-3 group/item">
                                    <Phone className="w-3.5 h-3.5 text-brushed-gold shrink-0 transition-transform group-hover/item:scale-110" />
                                    <span className="font-serif text-sm tracking-wide text-white group-hover/item:text-brushed-gold transition-colors">019-655 6243</span>
                                </a>
                            </div>
                            <div className="flex items-center gap-3 border-t border-white/5 pt-4 group/item">
                                <Mail className="w-3.5 h-3.5 text-brushed-gold shrink-0 transition-transform group-hover/item:scale-110" />
                                <a href="mailto:info@feeljapanwithk.com" className="text-[11px] text-white/70 hover:text-white transition-colors lowercase tracking-wider">
                                    info@feeljapanwithk.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-2">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
                    &copy; 2026 All rights reserved.
                </p>
                <div className="flex gap-6">
                    <Link href="/manage-studio" className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1.5 border-r border-white/10 pr-6">Studio Portal</Link>
                    <Link href="/partner-resources" className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors border-r border-white/10 pr-6">Partner Library</Link>
                    <Link href="/privacy" className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}

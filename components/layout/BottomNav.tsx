import Link from 'next/link';
import { Home, Compass, Heart, User } from 'lucide-react'; // Using Lucide as configured in package.json

export default function BottomNav() {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 sm:gap-8 bg-midnight-navy/90 backdrop-blur-xl px-7 sm:px-8 py-3.5 sm:py-4 rounded-full border border-white/10 shadow-2xl md:hidden w-[90%] max-w-[400px] justify-around">
            <Link href="/" className="flex flex-col items-center gap-1 group">
                <Home className="w-5 h-5 text-white stroke-[2.5]" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">Home</span>
            </Link>
            <Link href="/#collections" className="flex flex-col items-center gap-1 group">
                <Compass className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Portfolio</span>
            </Link>
            <Link href="/bulletin" className="flex flex-col items-center gap-1 group">
                <Heart className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Bulletin</span>
            </Link>
            <Link href="/agent/login" className="flex flex-col items-center gap-1 group">
                <User className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Account</span>
            </Link>
        </div>
    );
}

import Link from 'next/link';
import { Home, Compass, Heart, User } from 'lucide-react'; // Using Lucide as configured in package.json

export default function BottomNav() {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 bg-midnight-navy/90 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 shadow-2xl md:hidden">
            <Link href="/" className="flex flex-col items-center group">
                <Home className="w-5 h-5 text-white stroke-[2.5]" />
            </Link>
            <Link href="/brochure" className="flex flex-col items-center group">
                <Compass className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
            </Link>
            <Link href="/wishlist" className="flex flex-col items-center group">
                <Heart className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
            </Link>
            <Link href="/account" className="flex flex-col items-center group">
                <User className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
            </Link>
        </div>
    );
}

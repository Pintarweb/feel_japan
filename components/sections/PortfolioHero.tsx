import { ArrowDown } from 'lucide-react';

export default function PortfolioHero() {
    return (
        <section id="collections" className="relative h-[60vh] min-h-[500px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image - will be replaced by generated image */}
            <div className="absolute inset-0">
                <img
                    src="/b2b_collection_banner.png"
                    alt="Serene Kyoto Tea House"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4">
                <span className="block text-brushed-gold text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 animate-fade-in-up">
                    Exclusive Access
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tight animate-fade-in-up delay-100">
                    Our Range of Packages
                </h2>
                <div className="w-24 h-1 bg-brushed-gold mx-auto mb-8 animate-scale-x delay-200 origin-left"></div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <ArrowDown className="text-white/50 w-6 h-6" />
            </div>
        </section>
    );
}

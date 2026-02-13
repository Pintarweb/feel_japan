// import { Car, Utensils, Star } from 'lucide-react'; // Removing Lucide imports

const FEATURES = [
    {
        title: "Private Mobility",
        description: "Travel in the comfort of a private coach with a dedicated, professional driver-guide.",
        iconSrc: "/icon/alphard.png",
    },
    {
        title: "Muslim-friendly Hospitality",
        description: "Indulge in Japan’s well-known culinary offerings with strictly vetted Muslim-friendly and seafood-focused menus.",
        iconSrc: "/icon/cloche.png",
    },
    {
        title: "Faith-First Itineraries",
        description: "Experience Japan without compromise, with dedicated prayer times and spaces pre-arranged at every destination.",
        iconSrc: "/icon/mosque.png",
    }
];

export default function Features() {
    return (
        <section className="py-24 md:py-32 bg-white px-6 md:px-12 lg:px-20 border-b border-midnight-navy/5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 text-center md:text-left">
                {FEATURES.map((feature, idx) => (
                    <div key={idx} className="flex flex-col items-center md:items-start space-y-8 group">
                        <div className="relative h-32 w-32 mb-2 flex items-center justify-center">
                            {/* Simple, clean ambient glow */}
                            <div className="absolute inset-0 bg-brushed-gold/[0.04] rounded-full blur-2xl group-hover:bg-brushed-gold/[0.1] transition-all duration-700"></div>

                            <img
                                src={feature.iconSrc}
                                alt={feature.title}
                                className="relative z-10 object-contain h-32 w-32 contrast-[1.1] brightness-[0.85] group-hover:scale-105 transition-all duration-500 ease-out"
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl md:text-3xl font-serif font-medium text-midnight-navy tracking-tight italic">
                                {feature.title}
                            </h3>
                            <div className="w-12 h-0.5 bg-brushed-gold/40 group-hover:w-24 transition-all duration-700"></div>
                            <p className="text-sm md:text-base text-midnight-navy/85 leading-relaxed max-w-sm font-medium">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// import { Car, Utensils, Star } from 'lucide-react'; // Removing Lucide imports

const FEATURES = [
    {
        title: "Private VIP Mobility",
        description: "Travel in the comfort of a private coach (including premium Alphard or Grand Hiace models) with a dedicated, professional driver-guide.",
        iconSrc: "/icon/alphard.png",
    },
    {
        title: "Halal Excellence",
        description: "Indulge in Japan’s finest culinary offerings with strictly vetted Halal, Muslim-friendly, and seafood-focused menus.",
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
        <section className="py-16 md:py-24 bg-white px-6 md:px-12 md:px-20 border-b border-midnight-navy/5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                {FEATURES.map((feature, idx) => (
                    <div key={idx} className="flex flex-col items-center md:items-start space-y-4 group hover:-translate-y-1 transition-transform duration-300">
                        <div className="relative h-32 w-32 mb-4 flex items-center justify-center">
                            <img
                                src={feature.iconSrc}
                                alt={feature.title}
                                className="object-contain h-full w-full drop-shadow-md"
                            />
                        </div>
                        <h3 className="text-xl md:text-2xl font-serif font-medium text-midnight-navy tracking-tight">
                            {feature.title}
                        </h3>
                        <p className="text-sm md:text-base text-midnight-navy/70 leading-relaxed max-w-sm">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

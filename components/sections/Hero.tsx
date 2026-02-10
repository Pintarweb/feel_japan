import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full">
      <div className="relative h-[560px] md:h-screen w-full overflow-hidden">
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-midnight-navy/30 z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/60 via-transparent to-transparent z-10 pointer-events-none"></div>

        {/* Helper for Next.js Image Optimization - Using external URL from HTML for now */}
        {/* Ideally user would upload local asset or we use placeholder */}
        <div className="relative h-full w-full">
          <img
            alt="Zen Garden"
            className="h-full w-full object-cover object-center"
            src="/hero_alphard_zen.png?v=2"
          />
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-start justify-center p-8 text-left mt-0 md:pl-20 lg:pl-32 max-w-4xl">
          <span className="mb-4 text-xs font-bold tracking-[0.4em] text-white uppercase md:text-sm md:tracking-[0.6em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            B2B Exclusive
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight text-white mb-6 drop-shadow-lg">
            Seamless Luxury. <br />Spiritually Grounded.
          </h2>
          <p className="text-sm font-medium leading-relaxed text-white md:text-lg mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-2xl">
            Experience bespoke Muslim-friendly luxury with Feel Japan with K. We provide private VIP transportation, multilingual driver-guides, and curated Halal dining for a seamless and meaningful journey
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Primary CTA */}
            <Link
              href="#collections"
              className="bg-brushed-gold text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-midnight-navy transition-all duration-300 shadow-lg md:px-10 md:py-4 md:text-sm text-center"
            >
              Explore Private Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

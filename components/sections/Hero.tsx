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
            className="h-full w-full object-cover object-center scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtEh7tnxryPIdMfICi_8u48bZTmScW2lD9XgfDNuKAn93fMwZ3-J0S_u2xdkdja7JaECBDGGOl4TppjOUSr5cG1_2qjdKrJ2Xv749RsHKVHZ5eibAguraRhBVGS8PHn_FM7VUyKxN3VjzCDtH9lD4hREBMkusp3NWe6gRYjKrf9BPAoyB84E0r9Zb7Ssry5IsH9ubMqhzWen4HmkwLiFcsi1nYkY9ja1NzLGCRp4acYhjcYCTZpZqPk8xCtW3xC4_F2GUGgVmL8A-W"
          />
          {/* Logo Overlay */}
          <div className="absolute top-8 left-6 md:top-12 md:left-12 z-20 mix-blend-screen">
            <img
              src="/logo.jpeg"
              alt="Feel Japan with K Logo"
              className="w-32 md:w-48 lg:w-64"
              style={{ filter: 'invert(1) sepia(1) saturate(3000%) hue-rotate(210deg) brightness(120%) contrast(120%)' }}
            />
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center mt-8">
          <span className="mb-4 text-xs font-bold tracking-[0.4em] text-white uppercase md:text-sm md:tracking-[0.6em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            B2B Exclusive
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight text-white mb-6 drop-shadow-lg">
            The Art of <br />Japanese Luxury
          </h2>
          <p className="text-sm font-medium leading-relaxed text-white max-w-xs md:max-w-xl md:text-lg mb-8 italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Curated luxury experiences for discerning travel agents and corporate partners.
          </p>
          <Link
            href="#collections"
            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-midnight-navy transition-all duration-300 shadow-lg md:px-10 md:py-4 md:text-sm"
          >
            View Collections
          </Link>
        </div>
      </div>
    </section>
  );
}

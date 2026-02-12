'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HERO_IMAGES = [
  {
    src: '/hero_one.jpeg',
    alt: 'Japan Scenery 1'
  },
  {
    src: '/hero_two.jpeg',
    alt: 'Japan Scenery 2'
  },
  {
    src: '/hero_three.jpeg',
    alt: 'Japan Scenery 3'
  },
  {
    src: '/hero_four.jpeg',
    alt: 'Japan Scenery 4'
  },
  {
    src: '/hero_five.jpeg',
    alt: 'Japan Scenery 5'
  },
  {
    src: '/hero_six.jpeg',
    alt: 'Japan Scenery 6'
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full">
      <div className="relative h-[560px] md:h-screen w-full overflow-hidden bg-black">
        {/* Slider Images */}
        {HERO_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${index === currentIndex ? 'scale-105' : 'scale-100'
                }`}
              priority={index === 0}
            />
          </div>
        ))}

        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-midnight-navy/30 z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/60 via-transparent to-transparent z-10 pointer-events-none"></div>

        <div className="absolute inset-0 z-20 flex flex-col items-start justify-center p-8 text-left mt-0 md:pl-20 lg:pl-32 max-w-6xl">
          <span className="mb-4 text-xs font-bold tracking-[0.4em] text-white uppercase md:text-sm md:tracking-[0.6em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            B2B Exclusive
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight text-white mb-6 drop-shadow-lg">
            The Gold Standard in <br /> Muslim-friendly Japan Travel
          </h2>
          <p className="text-sm font-medium leading-relaxed text-white md:text-lg mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-2xl">
            We provide seamless private transportation, multilingual driver-guides, and Muslim-friendly dining for a meaningful journey
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Primary CTA */}
            <Link
              href="#collections"
              className="bg-brushed-gold text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-midnight-navy transition-all duration-300 shadow-lg md:px-10 md:py-4 md:text-sm text-center"
            >
              Explore Our Packages
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

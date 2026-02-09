import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import BrochureGrid from "@/components/sections/BrochureGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-off-white pb-24 relative">
      <Navbar />
      <Hero />
      <Features />
      <BrochureGrid />

      {/* Footer / Copyright */}
      <div className="py-12 text-center opacity-40 text-[10px] tracking-[0.15em] leading-relaxed uppercase px-8 text-midnight-navy">
        © 2026 FEEL JAPAN WITH K. ALL RIGHTS RESERVED.
        <div className="mt-1">EXCLUSIVELY FOR TRAVEL PARTNERS.</div>
      </div>

      <BottomNav />
    </main>
  );
}

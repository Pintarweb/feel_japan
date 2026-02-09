import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import BrochureGrid from "@/components/sections/BrochureGrid";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-off-white relative">
      <Navbar />
      <Hero />
      <Features />
      <BrochureGrid />
      <Footer />
      <BottomNav />
    </main>
  );
}

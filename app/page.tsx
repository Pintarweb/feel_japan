import Hero from "@/components/sections/Hero";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import BrochureGrid from "@/components/sections/BrochureGrid";
import InquiryForm from "@/components/sections/InquiryForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-off-white pb-24 relative">
      <Navbar />
      <Hero />
      <BrochureGrid />
      <InquiryForm />
      <BottomNav />
    </main>
  );
}

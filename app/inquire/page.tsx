import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import InquiryForm from "@/components/sections/InquiryForm";

export default function InquirePage() {
    return (
        <main className="min-h-screen bg-off-white pb-24 relative">
            <Navbar />

            <div className="pt-20">
                <InquiryForm />
            </div>

            <BottomNav />
        </main>
    );
}

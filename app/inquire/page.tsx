import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import InquiryForm from "@/components/sections/InquiryForm";
import Footer from "@/components/layout/Footer";
import { Suspense } from 'react';

export default function InquirePage() {
    return (
        <main className="min-h-screen bg-off-white relative">
            <Navbar />

            <div className="pt-20 pb-20">
                <Suspense fallback={<div>Loading form...</div>}>
                    <InquiryForm />
                </Suspense>
            </div>

            <Footer />
            <BottomNav />
        </main>
    );
}

import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import InquiryForm from "@/components/sections/InquiryForm";
import Footer from "@/components/layout/Footer";
import { Suspense } from 'react';
import { getBrochures } from "@/lib/services/brochureService";

import { createClient } from "@/lib/supabaseServer";

export default async function InquirePage() {
    const brochures = await getBrochures();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let agentProfile = null;
    if (user) {
        const { data: profile } = await supabase
            .from('agent_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        agentProfile = profile;
    }

    return (
        <main className="min-h-screen bg-off-white relative">
            <Navbar />

            <div className="pt-20 pb-20">
                <Suspense fallback={<div>Loading form...</div>}>
                    <InquiryForm
                        brochures={brochures}
                        isAgent={!!agentProfile}
                        agentProfile={agentProfile}
                    />
                </Suspense>
            </div>

            <Footer />
            <BottomNav />
        </main>
    );
}

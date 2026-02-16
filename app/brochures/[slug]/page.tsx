import BrochureTemplate from '@/components/sections/BrochureTemplate';
import { notFound } from 'next/navigation';
import { getBrochureBySlug } from '@/lib/services/brochureService';
import { createClient } from '@/lib/supabaseServer';

export default async function BrochurePage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { slug } = await params;
    const { view } = await searchParams;
    const decodedSlug = decodeURIComponent(slug);
    const brochure = await getBrochureBySlug(decodedSlug);

    if (!brochure) {
        notFound();
    }

    // Auth Check: Is this a verified agent?
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

    // Allow PDF Generator to bypass auth check
    const { print_pricing } = await searchParams; // Check if we are generating a PDF with pricing
    if (print_pricing === 'true') {
        agentProfile = { is_admin: true };
    }

    return <BrochureTemplate brochure={brochure} isAgent={!!agentProfile} agentProfile={agentProfile} />;
}

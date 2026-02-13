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

    let isAgent = false;
    if (user) {
        const { data: profile } = await supabase
            .from('agent_profiles')
            .select('id')
            .eq('id', user.id)
            .single();
        isAgent = !!profile;
    }

    return <BrochureTemplate brochure={brochure} isAgent={isAgent} />;
}

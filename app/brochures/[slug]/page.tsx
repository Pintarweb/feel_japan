import BrochureTemplate from '@/components/sections/BrochureTemplate';
import { notFound } from 'next/navigation';
import { getBrochures, getBrochureBySlug } from '@/lib/services/brochureService';

export async function generateStaticParams() {
    const brochures = await getBrochures();
    return brochures.map((brochure) => ({
        slug: brochure.slug,
    }));
}

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

    return <BrochureTemplate brochure={brochure} forceShowPricing={view === 'full'} />;
}

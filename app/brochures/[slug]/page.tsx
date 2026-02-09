import BrochureTemplate from '@/components/sections/BrochureTemplate';
import { notFound } from 'next/navigation';
import { getBrochures, getBrochureBySlug } from '@/lib/services/brochureService';

export async function generateStaticParams() {
    const brochures = await getBrochures();
    return brochures.map((brochure) => ({
        slug: brochure.slug,
    }));
}

export default async function BrochurePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const brochure = await getBrochureBySlug(decodedSlug);

    if (!brochure) {
        notFound();
    }

    return <BrochureTemplate brochure={brochure} />;
}

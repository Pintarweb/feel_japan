import { brochures } from '@/data/brochures';
import BrochureTemplate from '@/components/sections/BrochureTemplate';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return brochures.map((brochure) => ({
        slug: brochure.slug,
    }));
}

export default async function BrochurePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const brochure = brochures.find((b) => b.slug === decodedSlug);

    if (!brochure) {
        notFound();
    }

    return <BrochureTemplate brochure={brochure} />;
}

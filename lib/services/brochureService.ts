
import { supabase } from '../supabaseClient';
import { Brochure } from '@/types/brochure';

export const getBrochures = async (): Promise<Brochure[]> => {
    const { data, error } = await supabase
        .from('brochures')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching brochures:', error);
        return [];
    }

    return (data as any[]).map(item => ({
        id: item.id,
        slug: item.slug,
        image: item.image,
        category: item.category,
        city: item.city, // JSONB is automatically parsed
        title: item.title,
        subtitle: item.subtitle,
        summary: item.summary,
        tags: item.tags,
        highlights: item.highlights,
        itinerary: item.itinerary,
        pricing: item.pricing,
        inclusions: item.inclusions,
        exclusions: item.exclusions,
        paymentTerms: item.payment_terms // mapped from snake_case
    }));
};

export const getBrochureBySlug = async (slug: string): Promise<Brochure | null> => {
    const { data, error } = await supabase
        .from('brochures')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching brochure with slug ${slug}:`, error);
        return null;
    }

    if (!data) return null;

    return {
        id: data.id,
        slug: data.slug,
        image: data.image,
        category: data.category,
        city: data.city,
        title: data.title,
        subtitle: data.subtitle,
        summary: data.summary,
        tags: data.tags,
        highlights: data.highlights,
        itinerary: data.itinerary,
        pricing: data.pricing,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        paymentTerms: data.payment_terms
    };
};

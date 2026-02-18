
import { supabase } from '../supabaseClient';
import { Brochure } from '@/types/brochure';

export const getBrochures = async (): Promise<Brochure[]> => {
    const { data, error } = await supabase
        .from('brochures')
        .select('*')
        .or('is_archived.eq.false,is_archived.is.null')
        .or(`campaign_end.is.null,campaign_end.gte.${new Date().toISOString().split('T')[0]}`)
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
        paymentTerms: item.payment_terms,
        created_at: item.created_at,
        is_archived: item.is_archived,
        campaign_start: item.campaign_start,
        campaign_end: item.campaign_end,
        show_pricing: item.show_pricing,
        pdf_last_generated_at: item.pdf_last_generated_at,
        thumbnail_url: item.thumbnail_url
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
        paymentTerms: data.payment_terms,
        created_at: data.created_at,
        is_archived: data.is_archived,
        campaign_start: data.campaign_start,
        campaign_end: data.campaign_end,
        show_pricing: data.show_pricing,
        pdf_last_generated_at: data.pdf_last_generated_at,
        thumbnail_url: data.thumbnail_url
    };
};

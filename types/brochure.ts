export interface PricingTier {
    pax: string;
    adultPrice: number;
    childPriceWithBed?: number;
    childPriceNoBed?: number;
}

export interface Activity {
    icon: string;
    description: string;
}

export interface ItineraryDay {
    day: number;
    title: string;
    meals: string;
    description?: string;
    activities: Activity[];
}

export interface Brochure {
    id: string;
    slug: string;
    image: string;
    category: 'FIT' | 'GIT' | 'Corporate' | 'Seasonal';
    city: string | string[];
    title: string;
    subtitle: string;
    summary?: string;
    tags: {
        type: string;
        pax: string;
    };
    highlights: string[];
    itinerary: ItineraryDay[];
    pricing: {
        title: string;
        tiers: PricingTier[];
        surchargeNote: string;
        displayColumns?: string[];
    };
    inclusions: string[];
    exclusions: string[];
    paymentTerms: {
        deposit: string;
        finalPayment: string;
    };
    created_at: string;
    is_archived?: boolean;
    campaign_start?: string;
    campaign_end?: string;
    show_pricing?: boolean;
}

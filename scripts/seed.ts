
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const brochures = [
    {
        id: "fit-tokyo-summer-2026",
        slug: "5D4N Tokyo Mt Fuji Summer Discovery",
        image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&q=80&w=1920",
        category: "FIT",
        city: "Tokyo",
        title: "Tokyo: Summer Discovery",
        subtitle: "5D4N Round FIT Muslim Tour • Summer 2026",
        tags: { type: "Type 2", pax: "2 - 8 Pax Private" },
        highlights: ["Mt. Fuji", "Tokyo Skytree", "Asakusa", "Shibuya Crossing", "Disney Resort (Optional)"],
        itinerary: [
            {
                day: 1, title: "Arrival & Tokyo", meals: "(Lunch & Dinner Included)",
                activities: [
                    { icon: "UserCheck", description: "Meet and Greet by Tour Guide at Narita Airport lobby" },
                    { icon: "Bus", description: "Depart for **Tokyo City Tour**" },
                    { icon: "MapPin", description: "Visit **Asakusa Kannon Temple** & **Nakamise Street**" },
                    { icon: "Camera", description: "Photo stop at **Tokyo Skytree** and visit **Asakusa Mosque**" },
                    { icon: "ShoppingBag", description: "Explore **Ueno Ameyoko Street** and **Akihabara** Hobby Town" }
                ]
            },
            {
                day: 2, title: "Mt Fuji & Shinkansen", meals: "(Breakfast / Lunch / Dinner)",
                activities: [
                    { icon: "Bus", description: "Depart from hotel for **Mount Fuji Excursion**" },
                    { icon: "Mountain", description: "Visit **Mt. Fuji 5th Station**" },
                    { icon: "ShoppingBag", description: "Shopping at **Gotemba Premium Outlet**" },
                    { icon: "Train", description: "**Shinkansen** Experience: Odawara to Tokyo" },
                    { icon: "Footprints", description: "Group walk back to hotel" }
                ]
            },
            {
                day: 3, title: "Tokyo Modern Life", meals: "(Breakfast / Lunch)",
                activities: [
                    { icon: "ShoppingBag", description: "Visit **Harajuku** and **Tokyo Mosque**" },
                    { icon: "Camera", description: "Witness **Shibuya Crossing** & **Tsukiji Outer Market**" },
                    { icon: "MapPin", description: "Explore **Odaiba**" },
                    { icon: "Utensils", description: "Dinner by own arrangement" }
                ]
            },
            {
                day: 4, title: "Free & Easy", meals: "(Breakfast)", description: "No Guide support. Explore at your own leisure.",
                activities: [{ icon: "Star", description: "Recommended: Tokyo Disneyland or Disney Sea 1-Day Pass" }]
            },
            {
                day: 5, title: "Departure", meals: "(Breakfast)",
                activities: [
                    { icon: "Hotel", description: "Hotel check-out" },
                    { icon: "Bus", description: "Private transfer to Airport" },
                    { icon: "Plane", description: "Flight back home" }
                ]
            }
        ],
        pricing: {
            title: "Private FIT Tour • Summer 2026 Rates (JPY)",
            surchargeNote: "*Weekend/Holiday Surcharge: 2,000 YEN / Pax / Night applies.",
            tiers: [
                { pax: "2 Pax", adultPrice: 371200, childPriceWithBed: 368450 },
                { pax: "3 Pax", adultPrice: 278750, childPriceWithBed: 276000, childPriceNoBed: 226300 },
                { pax: "4 Pax", adultPrice: 231800, childPriceWithBed: 229100, childPriceNoBed: 179400 },
                { pax: "5 Pax", adultPrice: 204200, childPriceWithBed: 201500, childPriceNoBed: 164250 },
                { pax: "6 Pax", adultPrice: 184900, childPriceWithBed: 182150, childPriceNoBed: 132500 }
            ]
        },
        inclusions: ["4 Nights Stay: Shinjuku Washington Hotel", "Private Transportation", "English Speaking Guide"],
        exclusions: ["Weekend Surcharge", "Tipping", "International Flights"],
        paymentTerms: { deposit: "30% non-refundable", finalPayment: "70% 1 week before departure" }
    },
    {
        id: "fit-osaka-summer-2026",
        slug: "5D4N Osaka Kyoto Cultural Immersion",
        image: "/thumbnails/fit_osaka_summer.jpg",
        category: "FIT",
        city: "Osaka",
        title: "Osaka: Cultural Immersion",
        subtitle: "5D4N Osaka & Kyoto • Summer 2026",
        tags: { type: "Type 2", pax: "2 - 8 Pax Private" },
        highlights: ["Universal Studios Japan", "Kyoto Temples", "Arashiyama Bamboo Grove", "Dotonbori", "Nara Deer Park"],
        itinerary: [
            {
                day: 1, title: "Arrival & Osaka", meals: "(Dinner Included)",
                activities: [
                    { icon: "UserCheck", description: "Meet & Greet at Kansai Airport (KIX)" },
                    { icon: "Bus", description: "Transfer to **Osaka City**" },
                    { icon: "Camera", description: "Photo stop at **Osaka Castle**" },
                    { icon: "ShoppingBag", description: "Shopping at **Shinsaibashi** & **Dotonbori**" }
                ]
            },
            {
                day: 2, title: "Kyoto Heritage", meals: "(Breakfast / Lunch / Dinner)",
                activities: [
                    { icon: "Bus", description: "Depart for **Kyoto** (Ancient Capital)" },
                    { icon: "MapPin", description: "Visit **Kiyomizu Temple** (UNESCO World Heritage)" },
                    { icon: "ShoppingBag", description: "Stroll through **Sannenzaka & Ninenzaka**" },
                    { icon: "MapPin", description: "Visit **Fushimi Inari Shrine** (Torii Gates)" }
                ]
            },
            {
                day: 3, title: "Arashiyama & Nara", meals: "(Breakfast / Lunch)",
                activities: [
                    { icon: "Mountain", description: "Walk through **Arashiyama Bamboo Grove**" },
                    { icon: "Train", description: "Scenic **Sagano Romantic Train** (Optional)" },
                    { icon: "MapPin", description: "Visit **Nara Deer Park** & **Todaiji Temple**" },
                    { icon: "Utensils", description: "Dinner by own arrangement" }
                ]
            },
            {
                day: 4, title: "Free & Easy", meals: "(Breakfast)", description: "No Guide support.",
                activities: [{ icon: "Star", description: "Recommended: **Universal Studios Japan (USJ)**" }]
            },
            {
                day: 5, title: "Departure", meals: "(Breakfast)",
                activities: [
                    { icon: "Hotel", description: "Hotel check-out" },
                    { icon: "Bus", description: "Transfer to Kansai Airport (KIX)" }
                ]
            }
        ],
        pricing: {
            title: "Private FIT Osaka Tour • Summer 2026 Rates (JPY)",
            surchargeNote: "*Weekend/Holiday Surcharge applies.",
            tiers: [
                { pax: "2 Pax", adultPrice: 385000, childPriceWithBed: 380000 },
                { pax: "4 Pax", adultPrice: 245000, childPriceWithBed: 240000 },
                { pax: "6 Pax", adultPrice: 195000, childPriceWithBed: 190000 }
            ]
        },
        inclusions: ["4 Nights Stay: Osaka Hinode Hotel (Halal Friendly)", "Private Transport", "Guide"],
        exclusions: ["USJ Tickets", "Personal Expenses"],
        paymentTerms: { deposit: "30% non-refundable", finalPayment: "Full payment 1 week before" }
    },
    {
        id: "fit-tokyo-osaka-summer-2026",
        slug: "7D6N Golden Route Tokyo Osaka",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1920",
        category: "FIT",
        city: ["Tokyo", "Osaka"],
        title: "Golden Route: Best of Both",
        subtitle: "7D6N Tokyo, Mt Fuji, Kyoto & Osaka • Summer 2026",
        tags: { type: "Type 3", pax: "2 - 8 Pax Private" },
        highlights: ["Tokyo & Osaka Highlights", "Bullet Train", "Mt Fuji", "Kyoto Culture", "Universal Studios"],
        itinerary: [
            {
                day: 1, title: "Arrival Tokyo", meals: "(Dinner)",
                activities: [{ icon: "UserCheck", description: "Arrival Narita/Haneda" }, { icon: "MapPin", description: "Tokyo City Tour" }]
            },
            {
                day: 2, title: "Mt Fuji & Hakone", meals: "(B/L/D)",
                activities: [{ icon: "Mountain", description: "Mt Fuji 5th Station" }, { icon: "Droplet", description: "Lake Ashi Cruise" }]
            },
            {
                day: 3, title: "Bullet Train to Kyoto", meals: "(B/L/D)",
                activities: [{ icon: "Train", description: "Shinkansen to Kyoto" }, { icon: "MapPin", description: "Kiyomizu Temple" }]
            },
            {
                day: 4, title: "Kyoto & Osaka", meals: "(B/L/D)",
                activities: [{ icon: "Mountain", description: "Arashiyama Bamboo Grove" }, { icon: "MapPin", description: "Osaka Castle & Dotonbori" }]
            },
            {
                day: 5, title: "Free & Easy Osaka", meals: "(B)",
                activities: [{ icon: "Star", description: "Universal Studios Japan (Optional)" }]
            },
            {
                day: 6, title: "Free & Easy Tokyo", meals: "(B)",
                activities: [{ icon: "Train", description: "Return to Tokyo by Shinkansen" }]
            },
            {
                day: 7, title: "Departure", meals: "(B)",
                activities: [{ icon: "Plane", description: "Departure from Narita/Haneda" }]
            }
        ],
        pricing: {
            title: "Golden Route FIT • Summer 2026",
            surchargeNote: "*Seasonal rates apply",
            tiers: [
                { pax: "2 Pax", adultPrice: 550000, childPriceWithBed: 540000 },
                { pax: "4 Pax", adultPrice: 380000, childPriceWithBed: 370000 },
                { pax: "6 Pax", adultPrice: 320000, childPriceWithBed: 310000 }
            ]
        },
        inclusions: ["6 Nights Accommodation", "Inter-city Shinkansen", "Private Guide & Van"],
        exclusions: ["USJ/Disney Tickets"],
        paymentTerms: { deposit: "30%", finalPayment: "70% 2 weeks prior" }
    },
    {
        id: "git-tokyo-summer-2026",
        slug: "5D4N Corporate Tokyo Retreat",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1920",
        category: "GIT",
        city: "Tokyo",
        title: "Corporate Tokyo: Innovation",
        subtitle: "5D4N Group Incentive • Summer 2026",
        tags: { type: "Type 1", pax: "20 - 40 Pax Group" },
        highlights: ["Team Building", "Gala Dinner", "Tech Industry Visits", "Cultural Workshops"],
        itinerary: [
            { day: 1, title: "Arrival", meals: "(D)", activities: [{ icon: "UserCheck", description: "VIP Airport Welcome" }] },
            { day: 2, title: "Tokyo Innovation", meals: "(B/L/D)", activities: [{ icon: "MapPin", description: "TeamLab Planets" }, { icon: "MapPin", description: "Odaiba Tech Hub" }] },
            { day: 3, title: "Culture & Team Building", meals: "(B/L/D)", activities: [{ icon: "Utensils", description: "Sushi Making Workshop" }, { icon: "MapPin", description: "Asakusa Scavenger Hunt" }] },
            { day: 4, title: "Leisure / Meetings", meals: "(B)", activities: [{ icon: "Star", description: "Free time or Conference Room Booking" }] },
            { day: 5, title: "Departure", meals: "(B)", activities: [{ icon: "Plane", description: "Coach Transfer to Airport" }] }
        ],
        pricing: {
            title: "Corporate Group Rates",
            surchargeNote: "Based on minimum 20 pax",
            tiers: [{ pax: "20+ Pax", adultPrice: 150000 }]
        },
        inclusions: ["4 Star Accommodation", "Luxury Coach", "Gala Dinner Venue"],
        exclusions: ["Beverages during meals"],
        paymentTerms: { deposit: "50%", finalPayment: "1 month prior" }
    },
    {
        id: "git-osaka-summer-2026",
        slug: "5D4N Corporate Osaka Experience",
        image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=80&w=1920",
        category: "GIT",
        city: "Osaka",
        title: "Corporate Osaka: Gastronomy",
        subtitle: "5D4N Group Culinary Journey • Summer 2026",
        tags: { type: "Type 1", pax: "20 - 40 Pax Group" },
        highlights: ["Food Tours", "Osaka Castle", "Sake Brewery", "Nara Deer Park"],
        itinerary: [
            { day: 1, title: "Arrival KIX", meals: "(D)", activities: [{ icon: "Bus", description: "Transfer to Osaka" }] },
            { day: 2, title: "Osaka Highlights", meals: "(B/L/D)", activities: [{ icon: "MapPin", description: "Osaka Castle" }, { icon: "Utensils", description: "Kuromon Market Food Tour" }] },
            { day: 3, title: "Nara & Kyoto Day Trip", meals: "(B/L/D)", activities: [{ icon: "MapPin", description: "Nara Deer Park" }, { icon: "MapPin", description: "Fushimi Inari" }] },
            { day: 4, title: "Team Activity", meals: "(B)", activities: [{ icon: "Star", description: "USJ or Cup Noodle Museum" }] },
            { day: 5, title: "Departure", meals: "(B)", activities: [{ icon: "Plane", description: "Depart KIX" }] }
        ],
        pricing: {
            title: "Corporate Group Rates",
            surchargeNote: "Based on minimum 20 pax",
            tiers: [{ pax: "20+ Pax", adultPrice: 145000 }]
        },
        inclusions: ["Hotel Keihan or similar", "Private Coach", "Guide"],
        exclusions: ["Personal Expenses"],
        paymentTerms: { deposit: "50%", finalPayment: "1 month prior" }
    },
    {
        id: "git-tokyo-osaka-summer-2026",
        slug: "7D6N Corporate Golden Route",
        image: "https://images.unsplash.com/photo-1505069190533-da1c9af13346?auto=format&fit=crop&q=80&w=1920",
        category: "GIT",
        city: ["Tokyo", "Osaka"],
        title: "Corporate Golden Route",
        subtitle: "7D6N The Ultimate Incentive • Summer 2026",
        tags: { type: "Type 1", pax: "20 - 40 Pax Group" },
        highlights: ["Bullet Train", "Mt Fuji", "Gala Dinner Cruise", "Cultural Immersion"],
        itinerary: [
            { day: 1, title: "Arrival Tokyo", meals: "(D)", activities: [{ icon: "UserCheck", description: "Arrival" }] },
            { day: 2, title: "Tokyo Business/Leisure", meals: "(B/L/D)", activities: [{ icon: "MapPin", description: "City Tour" }, { icon: "Utensils", description: "Dinner Cruise" }] },
            { day: 3, title: "Mt Fuji Team Building", meals: "(B/L/D)", activities: [{ icon: "Mountain", description: "Mt Fuji Activity" }] },
            { day: 4, title: "Shinkansen to Kyoto", meals: "(B/L/D)", activities: [{ icon: "Train", description: "Bullet Train" }, { icon: "MapPin", description: "Geisha District Walk" }] },
            { day: 5, title: "Kyoto & Osaka", meals: "(B/L/D)", activities: [{ icon: "MapPin", description: "Kinkakuji Temple" }] },
            { day: 6, title: "Free Day Osaka", meals: "(B)", activities: [{ icon: "Star", description: "Shopping or USJ" }] },
            { day: 7, title: "Departure", meals: "(B)", activities: [{ icon: "Plane", description: "Depart KIX" }] }
        ],
        pricing: {
            title: "Corporate Group Rates",
            surchargeNote: "Based on minimum 20 pax",
            tiers: [{ pax: "20+ Pax", adultPrice: 220000 }]
        },
        inclusions: ["Luxury Accommodation", "All Transfers", "Meals"],
        exclusions: ["Alcohol"],
        paymentTerms: { deposit: "50%", finalPayment: "1 month prior" }
    }
];

async function seed() {
    console.log("Seeding brochures...");

    // Clear existing data (optional, but good for idempotency)
    const { error: deleteError } = await supabase.from('brochures').delete().neq('id', '0');
    if (deleteError) console.error("Error clearing table:", deleteError);

    for (const brochure of brochures) {
        const { error } = await supabase.from('brochures').insert({
            id: brochure.id,
            slug: brochure.slug,
            image: brochure.image,
            category: brochure.category,
            city: brochure.city,
            title: brochure.title,
            subtitle: brochure.subtitle,
            tags: brochure.tags,
            highlights: brochure.highlights,
            itinerary: brochure.itinerary,
            pricing: brochure.pricing,
            inclusions: brochure.inclusions,
            exclusions: brochure.exclusions,
            payment_terms: brochure.paymentTerms
        });

        if (error) {
            console.error(`Error inserting ${brochure.id}:`, error);
        } else {
            console.log(`Inserted ${brochure.id}`);
        }
    }
    console.log("Seeding complete.");
}

seed();


import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Brochure, ItineraryDay, PricingTier, Activity } from '../types/brochure';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function extractText(html: string, regex: RegExp, groupIndex = 1): string {
    const match = html.match(regex);
    return match && match[groupIndex] ? match[groupIndex].trim() : '';
}

function extractAllMatches(html: string, regex: RegExp, groupIndex = 1): string[] {
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        if (match[groupIndex]) {
            matches.push(match[groupIndex].trim());
        }
    }
    return matches;
}

function parseBrochureHTML(html: string, filename: string): any {
    // Basic Metadata
    const title = extractText(html, /<h1[^>]*class="[^"]*hero-text-shadow[^"]*"[^>]*>(.*?)<\/h1>/i) || filename.replace('.html', '');
    const subtitle = extractText(html, /<p[^>]*class="[^"]*text-xl[^"]*"[^>]*>(.*?)<\/p>/i);
    const bgImageMatch = html.match(/background:\s*linear-gradient[^,]+,\s*url\('([^']+)'\)/);
    const image = bgImageMatch ? bgImageMatch[1] : '';

    // ID and Slug
    // Use filename as ID base to be consistent
    let id = filename.toLowerCase().replace(/\.html$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Ensure absolute uniqueness by appending ID
    slug = `${slug}-${id}`;

    // Category & City
    const isGit = filename.toUpperCase().includes('GIT') || html.includes('Group Incentive');
    const category = isGit ? 'GIT' : 'FIT';

    let city: string | string[] = 'Japan'; // Default
    const lowerTitle = title.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    if ((lowerTitle.includes('tokyo') || lowerFilename.includes('tokyo')) && (lowerTitle.includes('osaka') || lowerFilename.includes('osaka'))) {
        city = ['Tokyo', 'Osaka'];
    } else if (lowerTitle.includes('tokyo') || lowerFilename.includes('tokyo')) {
        city = 'Tokyo';
    } else if (lowerTitle.includes('osaka') || lowerFilename.includes('osaka')) {
        city = 'Osaka';
    } else if (lowerTitle.includes('hokkaido')) {
        city = 'Hokkaido';
    } else if (lowerTitle.includes('fukuoka') || lowerFilename.includes('fukuoka')) {
        city = 'Fukuoka';
    } else if (lowerTitle.includes('kyushu')) {
        city = 'Kyushu';
    }

    // Tags
    const typeTag = extractText(html, /<span[^>]*bg-japan-red[^>]*>(.*?)<\/span>/);
    const paxTag = extractText(html, /<span[^>]*bg-white[^>]*text-black[^>]*>(.*?)<\/span>/);

    // Itinerary
    const itinerary: ItineraryDay[] = [];
    // Split by "Day" logic more robustly
    // We look for Day XX headings
    const dayMatches = [...html.matchAll(/<div[^>]*class="[^"]*w-full md:w-1\/3[^"]*"[^>]*>[\s\S]*?<span[^>]*>(Day \d+)<\/span>[\s\S]*?<h3[^>]*>(.*?)<\/h3>[\s\S]*?\((.*?)\)[\s\S]*?<\/div>[\s\S]*?<div[^>]*class="[^"]*w-full md:w-2\/3[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g)];

    for (const match of dayMatches) {
        const dayStr = match[1]; // Day 01
        const title = match[2]; // Title
        const meals = match[3]; // Meals
        const content = match[4]; // Content div

        const dayNum = parseInt(dayStr.replace(/[^0-9]/g, ''));

        const activities: Activity[] = [];
        const activityRegex = /<i class="([^"]*)".*?<\/i>\s*<div>\s*<p[^>]*font-bold[^>]*>(.*?)<\/p>\s*<p[^>]*text-sm[^>]*>(.*?)<\/p>/gs;
        let actMatch;
        while ((actMatch = activityRegex.exec(content)) !== null) {
            activities.push({
                icon: actMatch[1].replace('fa-solid fa-', '').split(' ')[0], // Simple icon name
                description: `**${actMatch[2]}**: ${actMatch[3]}`
            });
        }

        let description = '';
        if (activities.length === 0) {
            // Check for simple text description if no structured activities
            const descMatch = content.match(/<p class="[^"]*text-gray-700[^"]*">(.*?)<\/p>/);
            if (descMatch) description = descMatch[1];

            // Check for grid items (like Universal Studios)
            const gridItems = [...content.matchAll(/<div[^>]*bg-white[^>]*text-center[^>]*>(.*?)<\/div>/g)];
            gridItems.forEach(m => {
                activities.push({ icon: 'Star', description: m[1] });
            });
        }

        itinerary.push({
            day: dayNum,
            title: title || `Day ${dayNum}`,
            meals: meals ? `(${meals})` : '',
            description: description || undefined,
            activities
        });
    }

    // Pricing
    const pricingTitle = extractText(html, /<h2[^>]*Package Pricing[^>]*>([\s\S]*?)<\/h2>/);
    // Find the pricing section context
    const pricingSectionMatch = html.match(/Package Pricing([\s\S]*?)What's Included/);
    const pricingSection = pricingSectionMatch ? pricingSectionMatch[1] : '';

    // Parse Rows
    const tiers: PricingTier[] = [];
    const rowRegex = /<tr[^>]*>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>/g;
    let rowMatch;
    while ((rowMatch = rowRegex.exec(pricingSection)) !== null) {
        const pax = rowMatch[1].trim();
        // Basic cleaning of currency strings
        const adultPrice = parseInt(rowMatch[2].replace(/[^0-9]/g, ''));
        const childPrice = parseInt(rowMatch[3].replace(/[^0-9]/g, ''));

        if (pax && !isNaN(adultPrice)) {
            tiers.push({
                pax,
                adultPrice,
                childPriceWithBed: !isNaN(childPrice) ? childPrice : undefined
            });
        }
    }

    const surchargeNote = extractText(pricingSection, /\*Weekend Surcharge.*?:(.*?)</) || "Check with agent";

    // Inclusions
    const inclusions: string[] = [];
    const incSectionMatch = html.match(/What's Included([\s\S]*?)What's Excluded/);
    if (incSectionMatch) {
        const incMatches = [...incSectionMatch[1].matchAll(/<li[^>]*>[\s\S]*?<span>(.*?)<\/span>/g)];
        incMatches.forEach(m => inclusions.push(m[1].replace(/<[^>]*>/g, ''))); // Strip HTML tags inside
    }

    // Exclusions
    const exclusions: string[] = [];
    const excSectionMatch = html.match(/What's Excluded([\s\S]*?)Explicit Payment Terms/);
    if (excSectionMatch) {
        const excMatches = [...excSectionMatch[1].matchAll(/<li[^>]*>(.*?)<\/li>/g)];
        excMatches.forEach(m => exclusions.push(m[1].replace(/<[^>]*>/g, '')));
    }

    // Payment Terms
    const deposit = extractText(html, /Deposit.*?<\/p>\s*<p>(.*?)<\/p>/);
    const finalPayment = extractText(html, /Final Payment.*?<\/p>\s*<p>(.*?)<\/p>/);

    // Highlights (Extract 5 key terms from activities)
    const highlights = itinerary.flatMap(d => d.activities.map(a => a.description.split(':')[0].replace(/\*\*/g, ''))).slice(0, 5);

    return {
        id,
        slug,
        image,
        category,
        city,
        title,
        subtitle,
        tags: {
            type: typeTag || 'Standard',
            pax: paxTag || 'Group'
        },
        highlights,
        itinerary,
        pricing: {
            title: "Summer 2026 Rates",
            tiers,
            surchargeNote
        },
        inclusions,
        exclusions,
        paymentTerms: {
            deposit: deposit || "30% non-refundable",
            finalPayment: finalPayment || "Full payment required before departure"
        }
    };
}

async function seed() {
    console.log("Seeding brochures from HTML files...");

    const brochuresDir = path.join(process.cwd(), 'public/brochures');

    if (!fs.existsSync(brochuresDir)) {
        console.error(`Directory not found: ${brochuresDir}`);
        return;
    }

    const files = fs.readdirSync(brochuresDir).filter(file => file.endsWith('.html'));

    if (files.length === 0) {
        console.log("No HTML brochure files found.");
        return;
    }

    const brochures: Brochure[] = [];

    for (const file of files) {
        console.log(`Parsing ${file}...`);
        const html = fs.readFileSync(path.join(brochuresDir, file), 'utf-8');
        try {
            const brochure = parseBrochureHTML(html, file);
            brochures.push(brochure);
            // console.log(`Parsed ${brochure.id}: ${brochure.title}`);
        } catch (e) {
            console.error(`Failed to parse ${file}:`, e);
        }
    }

    // Insert into Supabase
    for (const brochure of brochures) {
        // Upsert to update existing entries
        const { error } = await supabase.from('brochures').upsert({
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
        }, { onConflict: 'id' });

        if (error) {
            console.error(`Error inserting ${brochure.id}:`, error);
        } else {
            console.log(`Inserted/Updated ${brochure.id}`);
        }
    }
    console.log("Seeding complete.");
}

seed();

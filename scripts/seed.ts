import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { ItineraryDay, PricingTier, Activity } from '../types/brochure';

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

function parseBrochureHTML(html: string, filename: string): any {
    // === ORIGINAL TITLE (from HTML) ===
    const titleMatch = html.match(/<h1[^>]*hero-text-shadow[^>]*>(.*?)<\/h1>/is);
    const originalTitle = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').trim() : filename.replace('.html', '');

    // === SUBTITLE ===
    const subtitleMatch = html.match(/<p[^>]*text-xl[^>]*>(.*?)<\/p>/is);
    const subtitle = subtitleMatch ? subtitleMatch[1].trim() : '';

    // === EXTRACT DURATION AND SEASON ===
    const durationMatch = subtitle.match(/(\d+D\d+N)/i);
    const duration = durationMatch ? durationMatch[1].toUpperCase() : '';
    const isSummer = subtitle.toLowerCase().includes('summer') || filename.toLowerCase().includes('summer');
    const season = isSummer ? 'Summer 2026' : '';

    // === BUILD DESCRIPTIVE TITLE ===
    // Format: "Destination Duration [Season] Tour"
    let title = originalTitle;
    if (duration && !originalTitle.includes(duration)) {
        title = `${originalTitle} ${duration}`;
    }
    if (season && !originalTitle.toLowerCase().includes('summer')) {
        title = `${title} ${season}`;
    }

    // === UNIQUE IMAGES PER BROCHURE ===
    // Map each brochure to a unique, relevant image
    const imageMap: Record<string, string> = {
        // Tokyo packages
        'fit-tokyo-4d3n-type-2': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1920', // Tokyo Tower
        'git-tokyo-4d3n-type-2': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1920', // Tokyo skyline
        'fittyosummer26': 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80&w=1920', // Mt Fuji with cherry blossoms
        'gittyosummer26': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1920', // Tokyo at night

        // Osaka packages
        'fit-osaka-4d3n-type-2': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&q=80&w=1920', // Osaka Castle
        'git-osaka-4d34n-type-2': 'https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?auto=format&fit=crop&q=80&w=1920', // Dotonbori
        'fitosksummer26': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=1920', // Fushimi Inari
        'gitosksummer26': 'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?auto=format&fit=crop&q=80&w=1920', // Kinkaku-ji

        // Golden Route (Tokyo-Osaka)
        'fittyoosksummer26': 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&q=80&w=1920', // Shinkansen Mt Fuji
        'gittyoosksummer26': 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=80&w=1920', // Traditional street
        'git-golden-route-tokyo-osaka-5d4n': 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&q=80&w=1920', // Bamboo grove

        // Special packages
        'fit-tokyo-hakuba-5d4n': 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1920', // Snow mountains
        'git-hokkaido-ice-breakership-4d34n': 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?auto=format&fit=crop&q=80&w=1920', // Hokkaido winter
        'git-fukuoka-nagasaki-4d3n': 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&q=80&w=1920', // Nagasaki lanterns
        'git-kyushu-6d5n-round-tour': 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?auto=format&fit=crop&q=80&w=1920', // Kyushu nature
    };

    // Get image from map or fallback to extracted
    const bgImageMatch = html.match(/url\(['"]?(https:\/\/images\.unsplash\.com[^'")\s]+)['"]?\)/);
    const id = filename.toLowerCase().replace(/\.html$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const image = imageMap[id] || (bgImageMatch ? bgImageMatch[1] : '');

    // === ID and SLUG ===
    let slug = originalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    slug = `${slug}-${id}`;

    // === CATEGORY & CITY ===
    const isGit = filename.toUpperCase().includes('GIT') || html.toLowerCase().includes('group incentive');
    const category = isGit ? 'GIT' : 'FIT';

    let city: string | string[] = 'Japan';
    const lowerTitle = title.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    if ((lowerTitle.includes('tokyo') || lowerFilename.includes('tyo')) &&
        (lowerTitle.includes('osaka') || lowerFilename.includes('osk'))) {
        city = ['Tokyo', 'Osaka'];
    } else if (lowerTitle.includes('tokyo') || lowerFilename.includes('tyo')) {
        city = 'Tokyo';
    } else if (lowerTitle.includes('osaka') || lowerFilename.includes('osk')) {
        city = 'Osaka';
    } else if (lowerTitle.includes('hokkaido')) {
        city = 'Hokkaido';
    } else if (lowerTitle.includes('fukuoka')) {
        city = 'Fukuoka';
    } else if (lowerTitle.includes('kyushu')) {
        city = 'Kyushu';
    } else if (lowerTitle.includes('kobe')) {
        city = 'Osaka'; // Kobe is part of Kansai region
    }

    // === TAGS ===
    const typeTagMatch = html.match(/<span[^>]*bg-japan-red[^>]*>(.*?)<\/span>/is);
    const paxTagMatch = html.match(/<span[^>]*bg-white[^>]*text-black[^>]*>(.*?)<\/span>/is);
    const typeTag = typeTagMatch ? typeTagMatch[1].trim() : 'Standard';
    const paxTag = paxTagMatch ? paxTagMatch[1].trim() : 'Private Tour';

    // === ITINERARY ===
    const itinerary: ItineraryDay[] = [];

    // Find all day blocks - handles multiple HTML formats
    // Format 1 (new): <span class="text-japan-red font-black text-xl ...">Day 01</span>
    // Format 2 (old): <span class="text-japan-red font-bold text-lg ...">Day 01</span>
    const dayBlockRegex = /<span[^>]*text-japan-red[^>]*(?:font-bold|font-black)[^>]*>(Day\s*\d+)<\/span>\s*<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gis;

    let dayMatch;
    const dayPositions: { index: number; dayNum: number; title: string; meals: string }[] = [];

    while ((dayMatch = dayBlockRegex.exec(html)) !== null) {
        const dayNum = parseInt(dayMatch[1].replace(/\D/g, ''));
        dayPositions.push({
            index: dayMatch.index,
            dayNum,
            title: dayMatch[2].replace(/&amp;/g, '&').trim(),
            meals: dayMatch[3].replace(/&amp;/g, '&').trim()
        });
    }

    // Also check for gray day headers (departure days) - both formats
    const grayDayRegex = /<span[^>]*text-gray-(?:400|500)[^>]*(?:font-bold|font-black)[^>]*>(Day\s*\d+)<\/span>\s*<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gis;
    while ((dayMatch = grayDayRegex.exec(html)) !== null) {
        const dayNum = parseInt(dayMatch[1].replace(/\D/g, ''));
        dayPositions.push({
            index: dayMatch.index,
            dayNum,
            title: dayMatch[2].replace(/&amp;/g, '&').trim(),
            meals: dayMatch[3].replace(/&amp;/g, '&').trim()
        });
    }

    // Third format: Compact grid layout (e.g., "Day 03" with h3 containing title and meal info in span)
    // <span class="font-bold text-japan-red uppercase text-xs tracking-widest">Day 03</span>
    const compactDayRegex = /<span[^>]*font-bold[^>]*(?:text-japan-red|text-gray-\d+)[^>]*>(Day\s*\d+)<\/span>\s*<h3[^>]*>(.*?)(?:<span[^>]*>(.*?)<\/span>)?<\/h3>/gis;
    while ((dayMatch = compactDayRegex.exec(html)) !== null) {
        const dayNum = parseInt(dayMatch[1].replace(/\D/g, ''));
        // Avoid duplicates
        if (!dayPositions.some(d => d.dayNum === dayNum)) {
            dayPositions.push({
                index: dayMatch.index,
                dayNum,
                title: dayMatch[2].replace(/&amp;/g, '&').replace(/<[^>]*>/g, '').trim(),
                meals: dayMatch[3] ? dayMatch[3].replace(/&amp;/g, '&').trim() : ''
            });
        }
    }

    // Sort by position in document
    dayPositions.sort((a, b) => a.index - b.index);

    // Extract activities for each day
    for (let i = 0; i < dayPositions.length; i++) {
        const day = dayPositions[i];
        const startIdx = day.index;
        const endIdx = i < dayPositions.length - 1 ? dayPositions[i + 1].index : html.indexOf('Package Pricing');

        const daySection = html.substring(startIdx, endIdx > startIdx ? endIdx : startIdx + 3000);

        const activities: Activity[] = [];

        // Helper function to map icon class to icon name
        const mapIcon = (iconClass: string): string => {
            if (iconClass.includes('check')) return 'Check';
            if (iconClass.includes('plane')) return 'Plane';
            if (iconClass.includes('bus') || iconClass.includes('van')) return 'Bus';
            if (iconClass.includes('hotel')) return 'Hotel';
            if (iconClass.includes('camera')) return 'Camera';
            if (iconClass.includes('map')) return 'MapPin';
            if (iconClass.includes('shopping') || iconClass.includes('bag')) return 'ShoppingBag';
            if (iconClass.includes('utensils')) return 'Utensils';
            if (iconClass.includes('train')) return 'Train';
            if (iconClass.includes('star') || iconClass.includes('sparkle')) return 'Star';
            if (iconClass.includes('ticket')) return 'Ticket';
            if (iconClass.includes('user')) return 'UserCheck';
            if (iconClass.includes('bottle')) return 'Droplet';
            if (iconClass.includes('mosque')) return 'Star';
            if (iconClass.includes('mountain')) return 'Mountain';
            if (iconClass.includes('torii')) return 'MapPin';
            if (iconClass.includes('box')) return 'Package';
            return 'Circle';
        };

        // Pattern 1: Extract list items (newer format)
        // Keep full descriptions as bullet points
        const liRegex = /<li[^>]*>\s*<i[^>]*fa-([a-z-]+)[^>]*><\/i>\s*(.*?)<\/li>/gis;
        let liMatch;
        while ((liMatch = liRegex.exec(daySection)) !== null) {
            const iconClass = liMatch[1];
            let description = liMatch[2]
                .replace(/<[^>]*>/g, '') // Remove any HTML tags
                .replace(/\*\*/g, '')    // Remove markdown bold markers
                .replace(/&amp;/g, '&')
                .trim();

            if (description) {
                activities.push({ icon: mapIcon(iconClass), description });
            }
        }

        // Pattern 2: Extract div-based activities (older format)
        // Use ONLY the title, not the description
        if (activities.length === 0) {
            const divRegex = /<div[^>]*flex[^>]*gap[^>]*>\s*<i[^>]*fa-([a-z-]+)[^>]*><\/i>\s*<div>\s*<p[^>]*>([^<]*)<\/p>\s*<p[^>]*>([^<]*)/gis;
            let divMatch;
            while ((divMatch = divRegex.exec(daySection)) !== null) {
                const iconClass = divMatch[1];
                // Use only the title as a short bullet point
                const title = divMatch[2].replace(/&amp;/g, '&').trim();

                if (title) {
                    activities.push({ icon: mapIcon(iconClass), description: title });
                }
            }
        }

        itinerary.push({
            day: day.dayNum,
            title: day.title,
            meals: day.meals,
            activities
        });
    }

    // === PRICING ===
    const tiers: PricingTier[] = [];

    // Find the pricing table
    const tableMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
    if (tableMatch) {
        const rows = tableMatch[1].match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
        if (rows) {
            for (const row of rows) {
                const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
                if (cells && cells.length >= 3) {
                    const pax = cells[0].replace(/<[^>]*>/g, '').trim();
                    const adultPrice = parseInt(cells[1].replace(/<[^>]*>/g, '').replace(/[^0-9]/g, ''));
                    const childPriceWithBed = parseInt(cells[2].replace(/<[^>]*>/g, '').replace(/[^0-9]/g, ''));
                    const childPriceNoBed = cells.length >= 4 ? parseInt(cells[3].replace(/<[^>]*>/g, '').replace(/[^0-9]/g, '')) : undefined;

                    if (pax && !isNaN(adultPrice)) {
                        tiers.push({
                            pax,
                            adultPrice,
                            childPriceWithBed: !isNaN(childPriceWithBed) ? childPriceWithBed : undefined,
                            childPriceNoBed: !isNaN(childPriceNoBed) ? childPriceNoBed : undefined
                        });
                    }
                }
            }
        }
    }

    // Surcharge note
    const surchargeMatch = html.match(/\*Weekend.*?Surcharge[^<]*/i);
    const surchargeNote = surchargeMatch ? surchargeMatch[0].trim() : '';

    // === INCLUSIONS ===
    const inclusions: string[] = [];
    const incSectionMatch = html.match(/What's Included([\s\S]*?)What's Excluded/i);
    if (incSectionMatch) {
        const incItems = incSectionMatch[1].match(/<li[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>/gi);
        if (incItems) {
            for (const item of incItems) {
                const spanMatch = item.match(/<span>([\s\S]*?)<\/span>/i);
                if (spanMatch) {
                    inclusions.push(spanMatch[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim());
                }
            }
        }
    }

    // === EXCLUSIONS ===
    const exclusions: string[] = [];
    const excSectionMatch = html.match(/What's Excluded([\s\S]*?)(?:Optional:|Payment Terms)/i);
    if (excSectionMatch) {
        const excItems = excSectionMatch[1].match(/<li[^>]*>•\s*(.*?)<\/li>/gi);
        if (excItems) {
            for (const item of excItems) {
                const text = item.replace(/<[^>]*>/g, '').replace(/•\s*/, '').replace(/&amp;/g, '&').trim();
                if (text) exclusions.push(text);
            }
        }
    }

    // === PAYMENT TERMS ===
    const depositMatch = html.match(/Deposit.*?<\/p>\s*<p>(.*?)<\/p>/is);
    const finalMatch = html.match(/Final Payment.*?<\/p>\s*<p>(.*?)<\/p>/is);
    const deposit = depositMatch ? depositMatch[1].replace(/<[^>]*>/g, '').trim() : "30% non-refundable deposit required";
    const finalPayment = finalMatch ? finalMatch[1].replace(/<[^>]*>/g, '').trim() : "Full payment 1 week before departure";

    // === HIGHLIGHTS ===
    // Extract key activities as highlights
    const highlights = itinerary
        .flatMap(d => d.activities.map(a => a.description))
        .filter(d => d.includes('**') || d.length > 10)
        .slice(0, 5)
        .map(h => h.replace(/\*\*/g, '').split(':')[0].trim());

    return {
        id,
        slug,
        image,
        category,
        city,
        title,
        subtitle,
        tags: { type: typeTag, pax: paxTag },
        highlights,
        itinerary,
        pricing: {
            title: "Summer 2026 Rates (JPY)",
            tiers,
            surchargeNote
        },
        inclusions,
        exclusions,
        paymentTerms: { deposit, finalPayment }
    };
}

async function seed() {
    console.log("Seeding brochures from HTML files...\n");

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

    console.log(`Found ${files.length} HTML files to process.\n`);

    for (const file of files) {
        console.log(`Parsing ${file}...`);
        const html = fs.readFileSync(path.join(brochuresDir, file), 'utf-8');

        try {
            const brochure = parseBrochureHTML(html, file);

            console.log(`  → Title: ${brochure.title}`);
            console.log(`  → Image: ${brochure.image ? '✓' : '✗'}`);
            console.log(`  → Itinerary: ${brochure.itinerary.length} days`);
            console.log(`  → Pricing: ${brochure.pricing.tiers.length} tiers`);

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
                console.error(`  ✗ Error: ${error.message}`);
            } else {
                console.log(`  ✓ Inserted/Updated ${brochure.id}\n`);
            }
        } catch (e) {
            console.error(`  ✗ Failed to parse: ${e}`);
        }
    }

    console.log("\nSeeding complete!");
}

seed();

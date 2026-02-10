import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Brochure, PricingTier, ItineraryDay, Activity } from '../types/brochure';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function extractText(html: string, regex: RegExp, groupIndex = 1): string {
    const match = html.match(regex);
    return match && match[groupIndex] ? match[groupIndex].trim() : '';
}

function parseBrochureHTML(html: string, filename: string): any {
    // === SCOPE TO HEADER TO AVOID CORRUPTION ===
    const headerMatch = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
    const headerHtml = headerMatch ? headerMatch[1] : html;

    // === ORIGINAL TITLE (from HTML Header) ===
    const titleMatch = headerHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const originalTitle = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim() : filename.replace('.html', '');

    // === SUBTITLE & SUMMARY ===
    const subtitleMatch = headerHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const originalSubtitle = subtitleMatch ? subtitleMatch[1].replace(/<[^>]*>/g, '').trim() : '';

    const id = filename.toLowerCase().replace(/\.html$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Premium Summaries (Brief overviews for thumbnails ONLY)
    const summaryMap: Record<string, string> = {
        'fit-osaka-4d3n-type-2': "A personalized journey through the spiritual heart of Japan, covering the historic landmarks of Osaka and the ancient beauty of Kyoto.",
        'fit-tokyo-4d3n-type-2': "Experience the vibrant energy of Tokyo and the majestic beauty of Mount Fuji in this private, halal-friendly family adventure.",
        'fit-tokyo-hakuba-5d4n': "The ultimate winter escape combining Tokyo's neon-lit streets with the world-class slopes and pristine snow of Hakuba.",
        'fitosksummer26': "A refreshing summer getaway to the Kansai region, exploring the hidden gems of Osaka, Kyoto, and the coastal charm of Kobe.",
        'fittyoosksummer26': "The definitive Japanese experience: cruise the 'Golden Route' from Tokyo's skyscrapers to Osaka's street food culture via Shinkansen.",
        'fittyosummer26': "Witness the splendor of Mount Fuji in full summer glory alongside the modern wonders of Tokyo on this curated private tour.",
        'git-fukuoka-nagasaki-4d3n': "Uncover the unique history and diverse flavors of Kyushu’s northern shores, from Nagasaki's peace memorials to Fukuoka's canal charm.",
        'git-golden-route-tokyo-osaka-5d4n': "An iconic traverse through Japan's spiritual and modern capitals, featuring breathtaking views of Mt. Fuji and professional group guidance.",
        'git-hokkaido-ice-breakership-4d34n': "A once-in-a-lifetime Arctic adventure: witness the drift ice of the Sea of Okhotsk from a powerful icebreaker in northern Hokkaido.",
        'git-kyushu-6d5n-round-tour': "A comprehensive exploration of Kyushu’s volcanic landscapes, thermal onsen towns, and the historic streets of its southern cities.",
        'git-osaka-4d34n-type-2': "Delve into the energetic soul of Osaka and the timeless elegance of Kyoto on this essential group tour of the Kansai region.",
        'git-tokyo-4d3n-type-2': "The perfect introduction to Japan: explore Tokyo’s historic temples, futuristic districts, and the stunning Five Lakes region near Mt. Fuji.",
        'gitosksummer26': "Discover the cultural riches of Japan's ancient capitals this summer, with curated group visits to Kyoto's golden temples and Osaka's vibrant landmarks.",
        'gittyoosksummer26': "Our signature Summer 2026 Golden Route tour: a grand traverse through Japan's past and present, from Tokyo's Harajuku to Osaka's Dotonbori.",
        'gittyosummer26': "Experience the quintessential Japanese summer: from Tokyo’s festive atmosphere to the breathtaking views of a snow-free Mount Fuji."
    };

    const summary = summaryMap[id] || "";

    // === EXTRACT DURATION AND SEASON FOR SUBTITLE ===
    const durationMatch = originalSubtitle.match(/(\d+D\d+N)/i) || filename.match(/(\d+D\d+N)/i);
    const durationStr = durationMatch ? durationMatch[1].toUpperCase() : '';
    const isSummerStr = filename.toLowerCase().includes('summer');
    const seasonStr = isSummerStr ? 'Summer 2026' : '';

    // The detail page should use the "technical" subtitle
    let subtitle = originalSubtitle;

    // If the original subtitle IS the summary (from previous mistakes), clear it
    if (Object.values(summaryMap).includes(subtitle)) {
        subtitle = "";
    }

    // Clean up generic "HALAL FAMILY FRIENDLY TOUR" if it's too long or redundant
    if (!subtitle || subtitle.length < 5) {
        subtitle = "HALAL FAMILY FRIENDLY TOUR";
    }

    // --- RESTRUCTURE SUBTITLE CLEANLY: [Duration] • [Content] • [Season] ---
    // 1. Strip redundant parts from original content
    if (durationStr) {
        subtitle = subtitle.replace(new RegExp(durationStr, 'ig'), '').trim();
    }
    if (seasonStr) {
        subtitle = subtitle.replace(new RegExp(seasonStr, 'ig'), '').trim();
    }
    // Remove stray dots resulting from stripping
    subtitle = subtitle.replace(/•/g, '').replace(/\s+/g, ' ').trim();

    // 2. Build parts
    const parts = [];
    if (durationStr) parts.push(durationStr);
    if (subtitle) parts.push(subtitle);
    if (seasonStr) parts.push(seasonStr);
    else parts.push('2026 Series'); // Generic season if none found

    subtitle = parts.join(' • ');

    // Final clean
    subtitle = subtitle.replace(/\s*•\s*•\s*/g, ' • ').replace(/\s*•\s*$/g, '').trim();

    // === UNIQUE IMAGES PER BROCHURE ===
    const imageMap: Record<string, string> = {
        'fit-tokyo-4d3n-type-2': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1920',
        'fittyosummer26': 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80&w=1920',
        'git-tokyo-4d3n-type-2': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1920',
        'gittyosummer26': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=1920',
        'fit-osaka-4d3n-type-2': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&q=80&w=1920',
        'fitosksummer26': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=1920',
        'git-osaka-4d34n-type-2': 'https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?auto=format&fit=crop&q=80&w=1920',
        'gitosksummer26': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&q=80&w=1920',
        'fittyoosksummer26': 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&get=80&w=1920',
        'gittyoosksummer26': 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=80&w=1920',
        'git-golden-route-tokyo-osaka-5d4n': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1920',
        'fit-tokyo-hakuba-5d4n': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1920',
        'git-hokkaido-ice-breakership-4d34n': 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?auto=format&fit=crop&q=80&w=1920',
        'git-fukuoka-nagasaki-4d3n': '/images/brochures/fukuoka-nagasaki.jpg',
        'git-kyushu-6d5n-round-tour': 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?auto=format&fit=crop&q=80&w=1920',
    };

    const bgImageMatch = html.match(/url\(['"]?(https:\/\/images\.unsplash\.com[^'")\s]+)['"]?\)/);
    const image = imageMap[id] || (bgImageMatch ? bgImageMatch[1] : '');

    // === SLUG ===
    let slug = originalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    slug = `${slug}-${id}`;

    // === CATEGORY & CITY ===
    const isGit = filename.toUpperCase().includes('GIT') || html.toLowerCase().includes('group incentive');
    const category = isGit ? 'GIT' : 'FIT';

    // Better City Detection
    const combined = (originalTitle + ' ' + filename + ' ' + originalSubtitle + ' ' + html.substring(0, 5000)).toLowerCase();
    let city: string | string[] = 'Japan';
    const cities: string[] = [];

    if (combined.includes('tokyo') || combined.includes('tyo')) cities.push('Tokyo');
    if (combined.includes('osaka') || combined.includes('osk')) cities.push('Osaka');
    if (combined.includes('kyoto') || combined.includes('kyo')) cities.push('Kyoto');
    if (combined.includes('kobe')) cities.push('Kobe');
    if (combined.includes('fukuoka') || combined.includes('fuk')) cities.push('Fukuoka');
    if (combined.includes('nagasaki')) cities.push('Nagasaki');
    if (combined.includes('hakuba')) cities.push('Hakuba');
    if (combined.includes('hokkaido')) cities.push('Hokkaido');
    if (combined.includes('kyushu')) cities.push('Kyushu');
    if (combined.includes('kumamoto')) cities.push('Kumamoto');
    if (combined.includes('beppu') || combined.includes('oita')) cities.push('Beppu');
    if (combined.includes('aso')) cities.push('Mount Aso');
    if (combined.includes('takachiho')) cities.push('Takachiho');

    if (cities.length > 0) {
        city = cities.length === 1 ? cities[0] : Array.from(new Set(cities)); // Deduplicate
    }

    // === PACKAGE TYPE & PAX TAGS (STRICT PILL PARSING) ===
    const pills = headerHtml.match(/<span[^>]*rounded-full[^>]*>([\s\S]*?)<\/span>/gi);
    let typeTag = isGit ? 'Group Tour' : 'Private Tour';
    let paxTag = 'Min 2 Pax';

    if (pills && pills.length >= 2) {
        typeTag = pills[0].replace(/<[^>]*>/g, '').trim();
        paxTag = pills[1].replace(/<[^>]*>/g, '').trim();
    } else if (pills && pills.length === 1) {
        // Fallback if only one pill found
        const text = pills[0].replace(/<[^>]*>/g, '').trim();
        if (text.toLowerCase().includes('pax')) paxTag = text;
        else typeTag = text;
    }

    // === TITLE (CLEAN) ===
    let title = originalTitle.replace(/\(\w+\)\s*/i, '').replace(/\d+D\d+N.*/i, '').trim();
    if (title.toLowerCase().endsWith('summer')) {
        title = title.substring(0, title.length - 6).trim();
    }

    // === ITINERARY PARSING (ROBUST FIX) ===
    const itinerary: ItineraryDay[] = [];
    const dayMatches = html.match(/<div[^>]*border-t-4[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<div[^>]*md:w-3\/4[^>]*>([\s\S]*?)<\/div>/gi);

    if (dayMatches) {
        dayMatches.forEach((block, idx) => {
            const dayNum = idx + 1;
            const dayTitle = extractText(block, /<h3[^>]*>([\s\S]*?)<\/h3>/i);
            const meals = extractText(block, /<p[^>]*text-[^>]*>([\s\S]*?)<\/p>/i);
            const description = extractText(block, /<p[^>]*font-semibold[^>]*>([\s\S]*?)<\/p>/i);

            const activities: Activity[] = [];
            const activityItems = block.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);

            if (activityItems) {
                activityItems.forEach(item => {
                    const iconMatch = item.match(/fa-([^"\s]+)/i) || item.match(/data-lucide="([^"]+)"/i);
                    let icon = 'MapPin';
                    if (iconMatch) {
                        const iconKey = iconMatch[1].toLowerCase();
                        if (iconKey.includes('calendar')) icon = 'Calendar';
                        else if (iconKey.includes('utensils') || iconKey.includes('check')) icon = 'Check';
                        else if (iconKey.includes('bus') || iconKey.includes('van')) icon = 'Bus';
                        else if (iconKey.includes('train')) icon = 'Train';
                        else if (iconKey.includes('plane')) icon = 'Plane';
                        else if (iconKey.includes('camera')) icon = 'Camera';
                        else if (iconKey.includes('mountain')) icon = 'Mountain';
                        else if (iconKey.includes('hotel')) icon = 'Hotel';
                    }

                    const desc = item.replace(/<i[\s\S]*?<\/i>/gi, '').replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/<[^>]*>/g, '').trim();
                    if (desc) {
                        activities.push({ icon, description: desc });
                    }
                });
            }

            itinerary.push({ day: dayNum, title: dayTitle, meals, description, activities });
        });
    }

    // === PRICING ===
    const tiers: PricingTier[] = [];
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
                            childPriceNoBed: (childPriceNoBed !== undefined && !isNaN(childPriceNoBed)) ? childPriceNoBed : undefined
                        });
                    }
                }
            }
        }
    }

    const surchargeMatch = html.match(/\*Weekend.*?Surcharge[\s\S]*?/i);
    const surchargeNote = surchargeMatch ? surchargeMatch[0].trim() : '';

    // === INCLUSIONS & EXCLUSIONS ===
    const inclusions: string[] = [];
    const incSectionMatch = html.match(/What's Included([\s\S]*?)What's Excluded/i);
    if (incSectionMatch) {
        const incItems = incSectionMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
        if (incItems) {
            for (const item of incItems) {
                const text = item.replace(/<i[\s\S]*?<\/i>/gi, '').replace(/<[^>]*>/g, '').trim();
                if (text) inclusions.push(text);
            }
        }
    }

    const exclusions: string[] = [];
    const excSectionMatch = html.match(/What's Excluded([\s\S]*?)Payment Terms/i);
    if (excSectionMatch) {
        const excItems = excSectionMatch[1].match(/<li>([\s\S]*?)<\/li>/gi);
        if (excItems) {
            for (const item of excItems) {
                exclusions.push(item.replace(/<[^>]*>/g, '').replace(/^•\s*/, '').trim());
            }
        }
    }

    // === PAYMENT TERMS ===
    const depositMatch = html.match(/Deposit \(Non-Refundable\)<\/p>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    const deposit = depositMatch ? depositMatch[1].trim() : '';
    const finalMatch = html.match(/Final Payment[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    const finalPayment = finalMatch ? finalMatch[1].trim() : '';
    const paymentTermsValue = { deposit, finalPayment };

    // === HIGHLIGHTS ===
    const highlights: string[] = [];
    const highlightsMatch = html.match(/Highlights:<\/h2>[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/i);
    if (highlightsMatch) {
        const hItems = highlightsMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
        if (hItems) {
            for (const item of hItems) {
                highlights.push(item.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim());
            }
        }
    }

    return {
        id,
        slug,
        image,
        category,
        city,
        title,
        subtitle,
        summary,
        tags: { type: typeTag, pax: paxTag },
        highlights,
        itinerary,
        pricing: { title: 'Estimated Pricing', tiers, surchargeNote },
        inclusions,
        exclusions,
        payment_terms: paymentTermsValue
    };
}

async function seed() {
    console.log('Starting seeding...');
    const brochuresDir = path.join(process.cwd(), 'public', 'brochures');
    const files = fs.readdirSync(brochuresDir).filter(file => file.endsWith('.html'));

    for (const file of files) {
        console.log(`Parsing ${file}...`);
        const html = fs.readFileSync(path.join(brochuresDir, file), 'utf-8');
        const brochure = parseBrochureHTML(html, file);

        const { error } = await supabase
            .from('brochures')
            .upsert(brochure, { onConflict: 'id' });

        if (error) {
            console.error(`Error inserting ${file}:`, error);
        } else {
            console.log(`  → Title: ${brochure.title}`);
            console.log(`  → Subtitle: ${brochure.subtitle}`);
            console.log(`  → Cities: ${Array.isArray(brochure.city) ? brochure.city.join(', ') : brochure.city}`);
            console.log(`  → Itinerary: ${brochure.itinerary.length} days`);
            console.log(`  ✓ Inserted/Updated ${brochure.id}`);
        }
        console.log('');
    }

    console.log('Seeding complete!');
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal error during seeding:', err);
    process.exit(1);
});

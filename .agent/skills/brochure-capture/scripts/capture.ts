
import { chromium, Browser, Page } from 'playwright';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env vars
dotenv.config({ path: '.env.local' });

// Configuration
const BASE_URL = 'https://feeljapanwithk.com';
const OUTPUT_ROOT = path.join(process.cwd(), 'dist', 'brochures');
const CLIENT_DIR = OUTPUT_ROOT; // Standard brochures saved directly in dist/brochures/
const AGENT_DIR = path.join(OUTPUT_ROOT, 'pricing'); // Pricing brochures saved in dist/brochures/pricing/
const ITINERARIES_PATH = path.join(process.cwd(), 'itineraries.json');
const LOGO_PATH = path.join(process.cwd(), 'public', 'logo_transparent.png');
const THUMBNAIL_DIR = path.join(OUTPUT_ROOT, 'thumbnails');
const BUCKET_NAME = 'brochures';

// CLI Arguments
const FORCE_CAPTURE = process.argv.includes('--force');
const TARGET_SLUG = process.argv.find(arg => arg.startsWith('--slug='))?.split('=')[1];

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addWatermark(pdfPath: string) {
    try {
        if (!fs.existsSync(LOGO_PATH)) {
            console.warn(`Watermark image not found at ${LOGO_PATH}, skipping watermark.`);
            return;
        }

        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Check extension
        const logoBytes = fs.readFileSync(LOGO_PATH);
        let logoImage;

        try {
            logoImage = await pdfDoc.embedPng(logoBytes);
        } catch (e) {
            logoImage = await pdfDoc.embedJpg(logoBytes);
        }

        const targetWidth = 200;
        const { width: logoW, height: logoH } = logoImage.scaleToFit(targetWidth, targetWidth);

        const pages = pdfDoc.getPages();
        for (const page of pages) {
            const { width, height } = page.getSize();
            const padding = 40;

            page.drawImage(logoImage, {
                x: width - logoW - padding,
                y: padding,
                width: logoW,
                height: logoH,
                opacity: 0.9,
            });
        }

        const modifiedPdfBytes = await pdfDoc.save();
        fs.writeFileSync(pdfPath, modifiedPdfBytes);
    } catch (err) {
        console.error(`Error adding watermark to ${path.basename(pdfPath)}:`, err);
    }
}

async function uploadToSupabase(filePath: string, storagePath: string) {
    try {
        const fileBuffer = fs.readFileSync(filePath);

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) {
            console.error(`Supabase Upload Error (${storagePath}):`, error.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(storagePath);
            console.log(`Uploaded to Supabase: ${publicUrl}`);
        }
    } catch (err) {
        console.error(`Upload exception (${storagePath}):`, err);
    }
}

async function updateDbMetadata(slug: string, thumbnailUrl?: string) {
    const updateData: any = { pdf_last_generated_at: new Date().toISOString() };
    if (thumbnailUrl) updateData.thumbnail_url = thumbnailUrl;

    const { error: dbError } = await supabase
        .from('brochures')
        .update(updateData)
        .eq('slug', slug);

    if (dbError) {
        console.warn(`Could not update DB metadata for slug ${slug}:`, dbError.message);
    } else {
        console.log(`Updated DB metadata for ${slug} (Timestamp + Thumbnail).`);
    }
}

async function ensureBucket() {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.find(b => b.name === BUCKET_NAME);

    const bucketOptions = {
        public: true,
        fileSizeLimit: 52428800,
        allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg']
    };

    if (!bucketExists) {
        console.log(`Bucket '${BUCKET_NAME}' not found. Creating...`);
        await supabase.storage.createBucket(BUCKET_NAME, bucketOptions);
    } else {
        // Update existing bucket to ensure mime types are allowed
        console.log(`Updating bucket '${BUCKET_NAME}' configuration...`);
        await supabase.storage.updateBucket(BUCKET_NAME, bucketOptions);
    }
}

/**
 * Intelligent Stale File Cleanup:
 * Only deletes files that do NOT have a corresponding record in the database.
 * This prevents accidental deletion of sibling brochures sharing the same slug but different categories (e.g., FIT vs GIT).
 * 
 * 2. **Hide Interactions:** Completely hide the "Request Quote" buttons, WhatsApp floating bubbles, and Agent Rate toggle buttons.
 * 3. **Hero Vibrancy:** Avoid heavy black tints. Use a translucent gradient (max 30% intensity at edges) and apply a `brightness(1.1)` filter to hero images to make them "exciting" and attractive.
 * 4. **Readability:** Maintain high-contrast text shadows on all white typography over hero images to ensure readability without sacrificing image brightness.
 * 5. **Thumbnail Clipping:** Thumbnails should be captured at 1200x1200px to focus on the brand identity and title without showing the itinerary body.
 */
async function performIntelligentCleanup(slug: string) {
    console.log(`--- Performing Intelligent Cleanup for slug: ${slug} ---`);

    // 1. Fetch ALL active categories for this slug from the database
    const { data: activeBrochures } = await supabase
        .from('brochures')
        .select('category')
        .eq('slug', slug);

    const activeCategories = (activeBrochures || []).map(b => b.category.toLowerCase());
    console.log(`Active categories for ${slug}:`, activeCategories);

    // 2. Local Cleanup
    const localDirs = [CLIENT_DIR, AGENT_DIR];
    for (const dir of localDirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir);

        // Find files matching the slug pattern
        const matches = files.filter(f => f.endsWith(`_${slug}.pdf`) || f.endsWith(`_${slug}_pricing.pdf`));

        for (const file of matches) {
            // Extract the category prefix (e.g., 'git' from 'git_tokyo.pdf')
            const prefix = file.split('_')[0].toLowerCase();

            // If the category prefix is NOT in our active list, it's a stale/ghost file
            if (!activeCategories.includes(prefix)) {
                try {
                    fs.unlinkSync(path.join(dir, file));
                    console.log(`Removed stale local file: ${file} (Category '${prefix}' no longer active for this slug)`);
                } catch (e) {
                    console.warn(`Could not delete local file ${file}:`, e);
                }
            }
        }
    }

    // 3. Supabase Cleanup
    const storageFolders = ['brochure', 'brochure-pricing'];
    for (const folder of storageFolders) {
        const { data: files, error } = await supabase.storage.from(BUCKET_NAME).list(folder);
        if (error || !files) continue;

        const staleFilePaths = files
            .filter(f => {
                const isMatch = f.name.endsWith(`_${slug}.pdf`) || f.name.endsWith(`_${slug}_pricing.pdf`);
                if (!isMatch) return false;

                const prefix = f.name.split('_')[0].toLowerCase();
                return !activeCategories.includes(prefix);
            })
            .map(f => `${folder}/${f.name}`);

        if (staleFilePaths.length > 0) {
            const { error: delError } = await supabase.storage.from(BUCKET_NAME).remove(staleFilePaths);
            if (delError) {
                console.warn(`Could not delete stale bucket files:`, delError.message);
            } else {
                console.log(`Purged ${staleFilePaths.length} stale assets from '${folder}' bucket path.`);
            }
        }
    }
}

async function captureView(page: Page, url: string, outputPath: string) {
    console.log(`Capturing: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(3000);

    // INJECT WEBSITE LINK INTO HEADER
    await page.evaluate(() => {
        const nav = document.querySelector('nav');
        if (nav) {
            const linkContainer = document.createElement('div');
            linkContainer.style.cssText = 'position: absolute; right: 30px; top: 50%; transform: translateY(-50%); z-index: 60; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; white-space: nowrap;';

            const ctaText = document.createElement('span');
            ctaText.innerText = "Check out our full collection at";
            ctaText.style.cssText = 'color: #0F172A; font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6; margin-bottom: 2px; font-family: ui-sans-serif, system-ui, sans-serif;';

            const link = document.createElement('a');
            link.href = 'https://feeljapanwithk.com';
            link.innerText = 'feeljapanwithk.com';
            link.style.cssText = 'color: #B49543; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;';

            linkContainer.appendChild(ctaText);
            linkContainer.appendChild(link);
            nav.appendChild(linkContainer);
        }
    });

    // HIDE INTERACTIVE UI BUT KEEP BRANDING (HEADER/FOOTER)
    await page.addStyleTag({
        content: `
            /* Hide Call-to-Actions and Floating Buttons */
            a[href^="/inquire"], a[href*="wa.me"], button:has(svg.lucide-eye), button:has(svg.lucide-eye-off), 
            .fixed.bottom-8, .fixed.bottom-52, .fixed.z-50.bottom-8, .fixed.z-50.bottom-32, #whatsapp-button,
            [data-umami-event="request-quote-click"] { display: none !important; }

            /* Header: Keep Logo, Hide Nav Tabs */
            nav { display: flex !important; }
            nav .absolute.left-1\\/2, nav .hidden.md\\:flex.items-center.gap-8, nav a[href="/login"] { display: none !important; }

            /* Footer: Keep Branding, Hide Policy/Portal Links */
            footer { display: block !important; }
            footer .flex.gap-6, footer a[href="/manage-studio"], footer a[href="/privacy"], footer a[href="/terms"], footer a[href="/partner-resources"] { display: none !important; }

            /* Hero: Exciting & Vibrant (Remove heavy dark tint) */
            header.relative.h-\\[60vh\\] { height: 400px !important; min-height: 0 !important; }
            header img { filter: brightness(1.1) !important; }
            header div.bg-black\\/70, header div.bg-gradient-to-b { 
                background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%) !important; 
                opacity: 1 !important;
            }
            header h2, header p, header span { text-shadow: 0 4px 8px rgba(0,0,0,0.6) !important; opacity: 1 !important; }
        `
    });

    const height = await page.evaluate(() => {
        return document.documentElement.scrollHeight;
    });

    await page.pdf({
        path: outputPath,
        width: '1200px',
        height: `${height}px`,
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        displayHeaderFooter: false
    });

    await addWatermark(outputPath);
}

async function captureThumbnail(page: Page, url: string, outputPath: string, storagePath: string): Promise<string | null> {
    console.log(`--- Creating Thumbnail: ${url} ---`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(2000);

    // Apply exact same brand-clean cleanup for the thumbnail
    await page.addStyleTag({
        content: `
            /* Hide all interactive/floating elements */
            nav .absolute.left-1\\/2, nav .hidden.md\\:flex.items-center.gap-8, nav a[href="/login"] { display: none !important; }
            footer .flex.gap-6, footer a[href="/manage-studio"], footer a[href="/privacy"], footer a[href="/terms"], footer a[href="/partner-resources"] { display: none !important; }
            .fixed, #whatsapp-button, a[href^="/inquire"], button { display: none !important; }

            /* Layout Fixes & Vibrance */
            header.relative.h-\\[60vh\\] { height: 450px !important; min-height: 0 !important; }
            header img { filter: brightness(1.1) !important; }
            header div.bg-black\\/70, header div.bg-gradient-to-b { 
                background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%) !important; 
                opacity: 1 !important;
            }
            header h2, header p, header span { text-shadow: 0 4px 8px rgba(0,0,0,0.6) !important; opacity: 1 !important; }
            body { background: white !important; }
        `
    });

    // Capture the top "hero" section
    await page.setViewportSize({ width: 1200, height: 1600 });
    await page.screenshot({
        path: outputPath,
        clip: { x: 0, y: 0, width: 1200, height: 1200 }
    });

    const fileBuffer = fs.readFileSync(outputPath);
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error(`Thumbnail Upload Error:`, error.message);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
    return publicUrl;
}

async function processSlug(page: Page, rawSlug: string) {
    let slug = rawSlug.replace(/^\/brochures\//, '').replace(/^\//, '');

    const urlPath = `/brochures/${slug}`;

    // Fetch latest category from Supabase to ensure accurate naming
    const { data: latestBrochure } = await supabase
        .from('brochures')
        .select('category')
        .eq('slug', slug)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

    const category = latestBrochure?.category?.toLowerCase() || (slug.includes('git') ? 'git' : (slug.includes('fit') ? 'fit' : 'general'));
    const baseName = slug.replace(/\//g, '-');

    // PERFORM INTELLIGENT CLEANUP (Protects sibling categories, removes ghosts)
    await performIntelligentCleanup(slug);

    // 1. Client Version (Standard)
    const clientUrl = `${BASE_URL}${urlPath}`;
    const clientFilename = `${category}_${baseName}.pdf`;
    const clientLocalPath = path.join(CLIENT_DIR, clientFilename);
    const clientStoragePath = `brochure/${clientFilename}`;

    console.log(`--- Processing Client Version: ${slug} ---`);
    await captureView(page, clientUrl, clientLocalPath);
    await uploadToSupabase(clientLocalPath, clientStoragePath);

    // 2. Agent Version (Pricing)
    const agentUrl = `${BASE_URL}${urlPath}?print_pricing=true`;
    const agentFilename = `${category}_${baseName}_pricing.pdf`;
    const agentLocalPath = path.join(AGENT_DIR, agentFilename);
    const agentStoragePath = `brochure-pricing/${agentFilename}`;

    console.log(`--- Processing Agent Version: ${slug} ---`);
    await captureView(page, agentUrl, agentLocalPath);
    await uploadToSupabase(agentLocalPath, agentStoragePath);

    // 3. Thumbnail (Snippet)
    const thumbFilename = `${category}_${baseName}_thumb.png`;
    const thumbLocalPath = path.join(THUMBNAIL_DIR, thumbFilename);
    const thumbStoragePath = `thumbnails/${thumbFilename}`;
    const thumbnailUrl = await captureThumbnail(page, clientUrl, thumbLocalPath, thumbStoragePath);

    // Update DB metadata after everything is done
    await updateDbMetadata(slug, thumbnailUrl || undefined);
}

async function main() {
    console.log(`Ensuring folder structure: ${OUTPUT_ROOT}`);
    if (!fs.existsSync(OUTPUT_ROOT)) fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
    if (!fs.existsSync(AGENT_DIR)) fs.mkdirSync(AGENT_DIR, { recursive: true });
    if (!fs.existsSync(THUMBNAIL_DIR)) fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });

    await ensureBucket();

    const browser = await chromium.launch();
    const page = await browser.newPage();

    if (TARGET_SLUG) {
        console.log(`Targeting single slug: ${TARGET_SLUG}`);
        await processSlug(page, TARGET_SLUG);
    } else {
        if (!fs.existsSync(ITINERARIES_PATH)) {
            console.error(`itineraries.json not found!`);
            process.exit(1);
        }
        const itineraries = JSON.parse(fs.readFileSync(ITINERARIES_PATH, 'utf-8'));
        console.log(`Processing all ${itineraries.length} itineraries...`);
        for (const slug of itineraries) {
            await processSlug(page, slug);
        }
    }

    await browser.close();
    console.log('Capture process complete.');
}

main().catch(console.error);

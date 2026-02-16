
import { chromium, Browser, Page } from 'playwright';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env vars
dotenv.config({ path: '.env.local' });

// Configuration
const BASE_URL = 'https://feel-japan.vercel.app';
const OUTPUT_DIR = path.join(process.cwd(), 'dist', 'brochures-pricing');
const ITINERARIES_PATH = path.join(process.cwd(), 'itineraries.json');
const LOGO_PATH = path.join(process.cwd(), 'public', 'logo_transparent.png');
const BUCKET_NAME = 'brochures-pricing';
const FORCE_CAPTURE = process.argv.includes('--force');

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

        // The user copied a JPEG to a .png extension, so pdf-lib fails with strict checking.
        // Try interpreting as JPEG first if PNG fails, or inspect header.
        // Simple robust logic: try PNG, catch -> try JPEG.
        try {
            logoImage = await pdfDoc.embedPng(logoBytes);
        } catch (e) {
            // Fallback to JPEG
            logoImage = await pdfDoc.embedJpg(logoBytes);
        }

        // Scale logo (example: 200px wide)
        const targetWidth = 200;
        const { width: logoW, height: logoH } = logoImage.scaleToFit(targetWidth, targetWidth); // Maintain aspect ratio

        const pages = pdfDoc.getPages();
        for (const page of pages) {
            const { width, height } = page.getSize();

            // Bottom Right Position with padding
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
        console.log(`Watermarked: ${path.basename(pdfPath)}`);
    } catch (err) {
        console.error(`Error adding watermark to ${path.basename(pdfPath)}:`, err);
    }
}

async function uploadToSupabase(filePath: string, filename: string) {
    try {
        const fileBuffer = fs.readFileSync(filePath);

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filename, fileBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) {
            console.error(`Supabase Upload Error (${filename}):`, error.message);
        } else {
            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(filename);
            console.log(`Uploaded to Supabase: ${publicUrl}`);
        }
    } catch (err) {
        console.error(`Upload exception (${filename}):`, err);
    }
}

async function ensureBucket() {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error('Error listing buckets:', error);
        return;
    }

    const bucketExists = buckets.find(b => b.name === BUCKET_NAME);

    if (!bucketExists) {
        console.log(`Bucket '${BUCKET_NAME}' not found. Creating...`);
        const { data, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 52428800, // 50MB
            allowedMimeTypes: ['application/pdf']
        });

        if (createError) {
            console.error(`Failed to create bucket '${BUCKET_NAME}':`, createError);
        } else {
            console.log(`Bucket '${BUCKET_NAME}' created successfully.`);
        }
    } else {
        console.log(`Bucket '${BUCKET_NAME}' exists.`);
    }
}

async function emptyBucket() {
    console.log(`Emptying bucket '${BUCKET_NAME}'...`);
    const { data: files, error } = await supabase.storage.from(BUCKET_NAME).list();

    if (error) {
        console.error('Error listing files for deletion:', error);
        return;
    }

    if (files && files.length > 0) {
        const filePaths = files.map(file => file.name);
        const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove(filePaths);

        if (deleteError) {
            console.error('Error deleting files from bucket:', deleteError);
        } else {
            console.log(`Deleted ${files.length} files from bucket.`);
        }
    } else {
        console.log('Bucket is already empty.');
    }
}

async function main() {
    console.log(`Using Output Dir: ${OUTPUT_DIR}`);
    console.log(`Using Logo Path: ${LOGO_PATH}`);

    await ensureBucket();
    await emptyBucket(); // Start fresh

    // Read Itineraries
    if (!fs.existsSync(ITINERARIES_PATH)) {
        console.error(`itineraries.json not found at ${ITINERARIES_PATH}!`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(ITINERARIES_PATH, 'utf-8');
    const itineraries = JSON.parse(fileContent); // Expecting array of strings

    if (!Array.isArray(itineraries) || itineraries.length === 0) {
        console.log('No itineraries found in itineraries.json');
        return;
    }

    console.log(`Starting capture for ${itineraries.length} itineraries...`);

    // Clean output directory (Gentle approach)
    if (fs.existsSync(OUTPUT_DIR)) {
        console.log('Cleaning output directory...');
        try {
            const files = fs.readdirSync(OUTPUT_DIR);
            for (const file of files) {
                try {
                    fs.unlinkSync(path.join(OUTPUT_DIR, file));
                } catch (e) {
                    console.warn(`Could not delete local file ${file} (locked?), skipping.`);
                }
            }
        } catch (err) {
            console.warn('Could not list output directory for cleaning, proceeding...');
        }
    } else {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    for (const slug of itineraries) {
        let relativeSlug = slug;
        // Normalize format
        if (!relativeSlug.startsWith('/')) relativeSlug = '/' + relativeSlug;

        const fullUrl = `${BASE_URL}${relativeSlug}?print_pricing=true`;

        // Extract Category from Slug
        let category = 'general';
        const lowerSlug = relativeSlug.toLowerCase();

        if (lowerSlug.includes('git')) {
            category = 'git';
        } else if (lowerSlug.includes('fit')) {
            category = 'fit';
        }

        // Clean filename
        const baseName = relativeSlug.replace(/^\/brochures\//, '').replace(/\//g, '-');

        // Final Filename: category_filename.pdf
        const filename = `${category}_${baseName}.pdf`;
        const outputPath = path.join(OUTPUT_DIR, filename);

        const shouldCapture = FORCE_CAPTURE || !fs.existsSync(outputPath);

        if (shouldCapture) {
            console.log(`Capturing: ${fullUrl} -> ${filename}`);
            let height = 0;
            try {
                // Increase timeout for heavy pages
                await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 90000 });
                await page.waitForTimeout(3000);

                // INJECT WEBSITE LINK INTO HEADER
                await page.evaluate(() => {
                    const nav = document.querySelector('nav');
                    if (nav) {
                        const linkContainer = document.createElement('div');
                        // Position safely on the right side
                        linkContainer.style.cssText = 'position: absolute; right: 30px; top: 50%; transform: translateY(-50%); z-index: 60; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; white-space: nowrap;';

                        const ctaText = document.createElement('span');
                        ctaText.innerText = "Check out our full collection at";
                        ctaText.style.cssText = `
                            color: #0F172A; 
                            font-size: 10px;
                            font-weight: 500;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                            opacity: 0.6;
                            margin-bottom: 2px;
                            font-family: ui-sans-serif, system-ui, sans-serif;
                        `;

                        const link = document.createElement('a');
                        link.href = 'https://feel-japan.vercel.app';
                        link.innerText = 'feel-japan.vercel.app'; // Clean URL text
                        link.style.cssText = `
                            color: #B49543; /* Brushed Gold color */
                            font-size: 14px;
                            font-weight: 700;
                            text-transform: uppercase;
                            letter-spacing: 0.1em;
                            text-decoration: none;
                            font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
                        `;

                        linkContainer.appendChild(ctaText);
                        linkContainer.appendChild(link);
                        nav.appendChild(linkContainer);
                    }
                });

                // HIDE UI ELEMENTS
                await page.addStyleTag({
                    content: `
                    a[href^="/inquire"],
                    a[href*="wa.me"],
                    button:has(svg.lucide-eye),
                    button:has(svg.lucide-eye-off), 
                    .fixed.bottom-8,
                    .fixed.bottom-52,
                    .fixed.z-50.bottom-8,
                    .fixed.z-50.bottom-32,
                    #whatsapp-button,

                    nav .absolute.left-1\\/2,
                    nav .hidden.md\\:flex.items-center.gap-8
                    { display: none !important; }
                    
                    nav, footer { display: flex !important; }

                    header.relative.h-\\[60vh\\] { 
                        height: 400px !important; 
                        min-height: 0 !important;
                    }

                    footer a[href="/manage-studio"],
                    footer a[href="/privacy"],
                    footer a[href="/terms"] {
                        display: none !important;
                    }
                `
                });

                // Calculate exact content height
                height = await page.evaluate(() => {
                    const footer = document.querySelector('footer');
                    if (footer) {
                        return footer.getBoundingClientRect().bottom + 2;
                    }
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
                console.log(`Saved Continuous PDF.`);

                await addWatermark(outputPath);
                await uploadToSupabase(outputPath, filename);

            } catch (err: any) {
                if (err.code === 'EBUSY') {
                    console.warn(`File ${filename} is locked. Saving as ${filename.replace('.pdf', '-new.pdf')} instead.`);
                    const newFilename = filename.replace('.pdf', '-new.pdf');
                    const newOutputPath = path.join(OUTPUT_DIR, newFilename);

                    await page.pdf({
                        path: newOutputPath,
                        width: '1200px',
                        height: `${height}px`,
                        printBackground: true,
                        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
                        displayHeaderFooter: false
                    });
                    console.log(`Saved Fallback PDF: ${newFilename}`);

                    await addWatermark(newOutputPath);
                    await uploadToSupabase(newOutputPath, newFilename);
                } else {
                    console.error(`Failed to capture ${slug}:`, err);
                }
            }
        } else {
            console.log(`Skipping ${filename} (exists). Uploading existing...`);
            await uploadToSupabase(outputPath, filename);
        }
    }

    await browser.close();
    console.log('Capture process complete.');
}

main().catch(console.error);

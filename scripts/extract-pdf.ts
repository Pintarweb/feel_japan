import { chromium } from 'playwright';
import * as path from 'path';

async function extractPdfText() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const pdfPath = path.join(process.cwd(), 'git_osaka-kyoto-kobe-gitosksummer26.pdf');
    const fileUrl = `file:///${pdfPath.replace(/\\/g, '/')}`;

    console.log(`Loading PDF from: ${fileUrl}`);

    await page.goto(fileUrl);
    await page.waitForTimeout(5000); // Give it a few seconds to render

    // In many browsers, PDF viewer is an embed or uses a specific internal page.
    // However, Playwright can often access the text layer if it's not a scanned image.
    // Let's try to get the text.
    const text = await page.evaluate(() => {
        // This might be tricky depending on how the browser renders the PDF.
        // If it's the built-in Chrome PDF viewer, it might be in a shadow DOM.
        return document.body.innerText;
    });

    console.log('--- EXTRACTED TEXT START ---');
    console.log(text);
    console.log('--- EXTRACTED TEXT END ---');

    await browser.close();
}

extractPdfText().catch(console.error);

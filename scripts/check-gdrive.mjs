import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to Google Drive folder...');
    await page.goto('https://drive.google.com/drive/folders/12EyCsqNct17avgwx4TjJqSuLIBdywWNm?usp=sharing', { waitUntil: 'networkidle' });

    // Wait for the grid of items to appear
    await page.waitForTimeout(5000);

    // Take a screenshot to verify what we see
    await page.screenshot({ path: 'gdrive_view.png', fullPage: true });

    // Extract file names
    const fileNames = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('[data-target="entry"]'));
        return items.map(item => item.getAttribute('aria-label') || item.innerText);
    });

    console.log('Files found:', fileNames);

    await browser.close();
})();

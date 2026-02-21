import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to root folder for thumbnails...');
    await page.goto('https://drive.google.com/drive/folders/12EyCsqNct17avgwx4TjJqSuLIBdywWNm?usp=sharing', { waitUntil: 'networkidle' });

    await page.waitForTimeout(5000);

    // Toggle Grid View
    const gridButton = page.locator('[aria-label="Grid view"]');
    if (await gridButton.count() > 0) {
        await gridButton.click();
        await page.waitForTimeout(5000);
        console.log('Switched to Grid view.');
    }

    await page.screenshot({ path: 'gdrive_root_grid.png', fullPage: true });

    await browser.close();
})();

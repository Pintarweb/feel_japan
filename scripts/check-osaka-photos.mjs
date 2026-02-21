import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to Osaka folder...');
    await page.goto('https://drive.google.com/drive/folders/12EyCsqNct17avgwx4TjJqSuLIBdywWNm?usp=sharing', { waitUntil: 'networkidle' });

    await page.waitForTimeout(3000);

    // Toggle Grid View
    const gridButton = page.locator('[aria-label="Grid view"]');
    if (await gridButton.count() > 0) {
        await gridButton.click();
        await page.waitForTimeout(2000);
    }

    // Click on the Osaka folder
    const osakaFolder = await page.getByText('Osaka', { exact: true });
    if (await osakaFolder.count() > 0) {
        // Need to find the specific folder item, not just any text containing Osaka
        const folderItem = page.locator('div[role="row"]:has-text("Osaka")').first();
        await folderItem.dblclick();
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'gdrive_osaka_view.png', fullPage: true });
        console.log('Inside Osaka folder.');
    } else {
        console.log('Osaka folder not found.');
    }

    await browser.close();
})();

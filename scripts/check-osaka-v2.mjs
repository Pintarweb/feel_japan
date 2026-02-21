import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to root folder...');
    await page.goto('https://drive.google.com/drive/folders/12EyCsqNct17avgwx4TjJqSuLIBdywWNm?usp=sharing', { waitUntil: 'networkidle' });

    await page.waitForTimeout(5000);

    console.log('Searching for Osaka folder...');
    // Try to find the Osaka link
    const osakaLink = page.locator('div[role="row"] >> text=Osaka').first();
    if (await osakaLink.count() > 0) {
        await osakaLink.dblclick();
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'gdrive_osaka_view.png', fullPage: true });
        console.log('Success: Inside Osaka folder.');
    } else {
        console.log('Fallback: Searching for Osaka text directly.');
        await page.getByText('Osaka', { exact: true }).first().click({ clickCount: 2 });
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'gdrive_osaka_view.png', fullPage: true });
    }

    await browser.close();
})();

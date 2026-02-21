import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to Tokyo folder...');
    // We need to find the link for the "TOKYO 5D4N PROMO GIT - Jpg" folder
    // Based on the previous screenshot, I'll try to click the text.
    await page.goto('https://drive.google.com/drive/folders/12EyCsqNct17avgwx4TjJqSuLIBdywWNm?usp=sharing', { waitUntil: 'networkidle' });

    await page.waitForTimeout(3000);

    // Click on the Tokyo folder
    const tokyoFolder = await page.getByText('TOKYO 5D4N PROMO GIT - Jpg');
    if (await tokyoFolder.count() > 0) {
        await tokyoFolder.click({ clickCount: 2 }); // Double click to open
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'gdrive_tokyo_view.png', fullPage: true });
        console.log('Inside Tokyo folder.');
    } else {
        console.log('Tokyo folder not found.');
    }

    await browser.close();
})();

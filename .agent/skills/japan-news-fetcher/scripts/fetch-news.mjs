
import { chromium } from 'playwright';

async function fetchNews() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Navigating to JNTO Malaysia Travel Trade News...');
        await page.goto('https://www.japan.travel/en/my/travel-trade/news/', { waitUntil: 'networkidle' });

        // Debug: Log some of the page content to see what we're working with
        const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
        // console.log('Page Content Preview:', bodyText);

        // Broad selectors to catch any list items that might be news
        const newsItems = await page.$$eval('article, .p-news-list__item, .news-list li, .news_list li, .post, .entry', items => {
            return items.map(item => {
                const titleEl = item.querySelector('h1, h2, h3, h4, .title, .p-news-list__item-title, a');
                const dateEl = item.querySelector('.date, .time, .p-news-list__item-date, span');
                const linkEl = item.querySelector('a');

                return {
                    title: titleEl?.textContent?.trim() || 'No Title',
                    date: dateEl?.textContent?.trim() || 'No Date',
                    url: linkEl?.href || '#'
                };
            }).filter(item => item.title !== 'No Title' && item.url !== '#').slice(0, 5);
        });

        if (newsItems.length === 0) {
            // Last ditch effort: find all links that look like news
            const allLinks = await page.$$eval('a', links => {
                return links
                    .filter(a => a.href.includes('/news/') || a.textContent.toLowerCase().includes('news'))
                    .map(a => ({ title: a.textContent.trim(), url: a.href }))
                    .slice(0, 5);
            });

            if (allLinks.length > 0) {
                console.log(JSON.stringify(allLinks, null, 2));
            } else {
                console.log(JSON.stringify({ status: "No new updates" }, null, 2));
            }
        } else {
            console.log(JSON.stringify(newsItems, null, 2));
        }

    } catch (error) {
        console.error('Error fetching news:', error.message);
    } finally {
        await browser.close();
    }
}

fetchNews();

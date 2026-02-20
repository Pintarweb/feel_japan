
import { chromium } from 'playwright';

const SOURCES = [
    {
        name: 'JNTO Malaysia',
        url: 'https://www.japan.travel/en/my/travel-trade/news/',
        category: 'Official Regulatory Alert',
        selectors: {
            item: 'article, .p-news-list__item, .news-list li',
            title: 'h1, h2, h3, .p-news-list__item-title, a',
            link: 'a'
        }
    },
    {
        name: 'Halal Media Japan',
        url: 'https://halalmedia.jp/',
        category: 'Muslim-Friendly Spotlight',
        selectors: {
            item: '.post, .entry, article',
            title: 'h1, h2, h3, .entry-title, a',
            link: 'a'
        }
    },
    {
        name: 'Travel Voice Japan',
        url: 'https://www.travelvoice.jp/english/',
        category: 'Strategic Opportunities',
        selectors: {
            item: '.article-item, .post, article',
            title: 'h1, h2, h3, .title, a',
            link: 'a'
        }
    }
];

const B2B_KEYWORDS = {
    operational: ['visa', 'jesta', 'tax', 'jr pass', 'visit japan web', 'entry', 'requirement'],
    muslim: ['halal', 'prayer', 'mosque', 'pork-free', 'muslim'],
    b2b: ['mice', 'incentive', 'fam trip', 'travel trade', 'matta', 'b2b', 'brochure', 'agent'],
    malaysia: ['kuala lumpur', 'airasia', 'malaysia airlines', 'myr', 'ringgit']
};

function translateToB2B(title) {
    const t = title.toLowerCase();
    if (t.includes('tax') || t.includes('jesta') || t.includes('visa')) return `Action Required: Update Your Quotations & Advisories`;
    if (t.includes('campaign') || t.includes('launch')) return `New Marketing Assets Available for Your Clients`;
    if (t.includes('halal') || t.includes('muslim')) return `New Muslim-Friendly Facility/Service Opened`;
    if (t.includes('incentive') || t.includes('mice')) return `Strategic MICE/Incentive Opportunity Found`;
    if (t.includes('matta') || t.includes('fair')) return `Action Required: Prepare for Upcoming Travel Fair`;
    return title;
}

async function fetchFromSource(browser, source) {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
        console.log(`Scanning ${source.name}...`);
        await page.goto(source.url, { waitUntil: 'networkidle', timeout: 30000 });

        const items = await page.$$eval(source.selectors.item, (elements, selectors) => {
            return elements.map(el => {
                const titleEl = el.querySelector(selectors.title);
                const linkEl = el.querySelector(selectors.link);
                return {
                    rawTitle: titleEl?.textContent?.trim() || '',
                    url: linkEl?.href || ''
                };
            }).filter(i => i.rawTitle.length > 5 && i.url.startsWith('http'));
        }, source.selectors);

        // Filter by keywords
        const filtered = items.filter(item => {
            const text = (item.rawTitle).toLowerCase();
            return Object.values(B2B_KEYWORDS).flat().some(kw => text.includes(kw));
        }).slice(0, 2);

        return filtered.map(f => ({
            ...f,
            source: source.name,
            category: source.category,
            b2bTitle: translateToB2B(f.rawTitle)
        }));
    } catch (e) {
        console.error(`Error scanning ${source.name}:`, e.message);
        return [];
    } finally {
        await context.close();
    }
}

async function runFetcher() {
    const browser = await chromium.launch({ headless: true });
    let allNews = [];

    try {
        for (const source of SOURCES) {
            const results = await fetchFromSource(browser, source);
            allNews = [...allNews, ...results];
        }

        if (allNews.length === 0) {
            console.log(JSON.stringify({ status: "No high-priority B2B alerts found today." }, null, 2));
        } else {
            console.log(JSON.stringify(allNews, null, 2));
        }

    } finally {
        await browser.close();
    }
}

runFetcher();

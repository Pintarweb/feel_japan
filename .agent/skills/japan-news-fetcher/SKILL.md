---
name: japan-news-fetcher
description: Fetches and summarizes the latest travel trade news from JNTO Malaysia for B2B partners.
---

# Japan News Fetcher Skill

**Goal:** Fetch and summarize the latest travel trade news from JNTO Malaysia for B2B partners.

**Instructions:**
1. Use the `scripts/fetch-news.ts` script to navigate to the JNTO Malaysia Travel Trade news page: `https://www.japan.travel/en/my/travel-trade/news/`
2. Extract the top 3-5 news headlines, dates, and links.
3. Summarize each headline into a "B2B Takeaway" (Why a travel agent should care).
4. Output the result formatted as a JSON object or directly update the Bulletin section if requested.

**Execution:**
- The script is located at `.agent/skills/japan-news-fetcher/scripts/fetch-news.mjs`.
- Run using `node .agent/skills/japan-news-fetcher/scripts/fetch-news.mjs`.

**Constraints:**
- Only include news from the current year (2026/2025 - will check actual dates).
- If no news is found, return a "No new updates" status.
- Ensure summaries focus on B2B value (Marketing, Logistics, New Campaigns).

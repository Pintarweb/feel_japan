---
name: japan-news-filter
description: A high-authority B2B news filter that scans JNTO, Halal Media, and industry sources for strategic signals for Malaysian travel partners.
---

# Japan News Filter (B2B Strategic Agent)

**Goal:** Act as a "B2B Filter" to minimize clutter and maximize strategic authority for Feel Japan with K.

**Instructions:**
1. **Source Selection:** Scan these three sources:
   - JNTO Malaysia: `https://www.japan.travel/en/my/travel-trade/news/` (Regulatory/B2B)
   - Halal Media Japan: `https://halalmedia.jp/` (Muslim-Friendly expertise)
   - Travel Voice Japan: `https://www.travelvoice.jp/english/` (Industry trends)

2. **The "B2B Priority" Filter:** Prioritize news containing:
   - **Operational:** Visa, JESTA, Lodging Tax, Tax-Free, JR Pass, Visit Japan Web.
   - **Muslim-Friendly:** Halal, Prayer Room, Mosque, Pork-Free.
   - **B2B Opportunities:** MICE, Incentive, FAM Trip, Travel Trade, MATTA.
   - **Local Interest:** Kuala Lumpur, AirAsia, Malaysia Airlines, MYR to JPY.

3. **The "B2B Translation" Skill:**
   - Transform headlines from passive/generic to active/strategic.
   - Example: "Lodging tax increase" -> "Action Required: Update Your Quotations for 2026."
   - Example: "New campaign" -> "New Marketing Assets Available for Your Clients."

4. **Dashboard Categories:**
   - **Official Regulatory Alert:** Critical laws, taxes, or visa updates.
   - **Muslim-Friendly Spotlight:** New halal restaurant/facility openings.
   - **Strategic Opportunities:** FAM trips, support menus, or MICE data.

**Execution:**
- Script: `.agent/skills/japan-news-filter/scripts/fetch-news.mjs`
- Run: `node .agent/skills/japan-news-filter/scripts/fetch-news.mjs`

**Constraints:**
- No "clutter" (political news, celebrity gossip, or general culture).
- Every output must include a "B2B Takeaway."
- Focus on the 2026 travel landscape.

---
description: Refresh the Japan Insider Bulletin with the latest B2B filtered news.
---

# /refresh-bulletin Workflow

This workflow automates the process of gathering the latest B2B signals and updating the website's bulletin page.

// turbo
1. Run the @japan-news-filter skill to scan all sources.
   ```bash
   node .agent/skills/japan-news-filter/scripts/fetch-news.mjs
   ```

2. Review the output for high-priority B2B alerts.
3. Update `app/bulletin/page.tsx` with the new data:
   - Synchronize the `B2B_INSIDER_ALERTS` array.
   - Update the `NEWS_UPDATES` feed.
   - Refine the "B2B Strategy Takeaways" for each new item.

4. Commit the updates to the repository.
   ```bash
   git add app/bulletin/page.tsx
   git commit -m "feat: refresh bulletin with latest B2B strategic intelligence"
   git push origin master
   ```

5. Confirm to the USER that the B2B Intelligence Hub is now up to date.

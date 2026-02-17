---
name: brochure-capture
description: Automatically visits Feel Japan itinerary URLs, captures them as continuous PDFs, applies a logo watermark, and uploads them to Supabase Storage. Use this when the website itineraries change or when new brochures are needed for prospects.
---

# Instructions
1.  **Read URLs:** Get the itinerary URLs from the `itineraries.json` file in the project root.
2.  **Browser Setup:** Use Playwright (Node.js/TypeScript) to launch a headless browser.
3.  **Capture:** Navigate to each URL (Live Site: `https://feel-japan.vercel.app`), wait for images/fonts to load, and save as a continuous PDF locally to `dist/brochures/`.
4.  **Watermark:** Use `pdf-lib` to overlay `assets/feel-japan-logo.png` on the bottom-right of every page directly within the script.
5.  **Upload:** Upload the final watermarked PDFs to the Supabase Storage bucket named `brochures`.

# New Organization Logic
1. **Standard Brochures (Client-Facing):**
   - **Local Location:** `dist/brochures/`
   - **Supabase Bucket Path:** `brochure/`
   - **Naming:** `${category}_${slug}.pdf` (e.g., `git_tokyo-adventure.pdf`)
   - **Content:** High-fidelity capture of the public view (no net rates).

2. **Pricing Brochures (Agent-Only):**
   - **Local Location:** `dist/brochures/pricing/`
   - **Supabase Bucket Path:** `brochure-pricing/`
   - **Naming:** `${category}_${slug}_pricing.pdf` (e.g., `git_tokyo-adventure_pricing.pdf`)
   - **Content:** Complete capture including Net Agent Rates and full pricing breakdowns.

# Usage
Run the skill using:
```bash
npx tsx .agent/skills/brochure-capture/scripts/capture.ts
```
To force re-capture existing PDFs:
```bash
npx tsx .agent/skills/brochure-capture/scripts/capture.ts --force
```

# Constraints
- Do not re-capture if a PDF already exists locally unless the `--force` flag is used.
- Ensure the PDF filename matches the `${category}_${slug}` pattern.
- Ensure the Supabase Storage bucket `brochures` exists and uses the specified folder paths.

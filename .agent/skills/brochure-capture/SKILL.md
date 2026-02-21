---
name: brochure-capture
description: Automatically visits Feel Japan itinerary URLs, captures them as continuous PDFs, applies a logo watermark, and uploads them to Supabase Storage. Use this when the website itineraries change or when new brochures are needed for prospects.
---

# Instructions
1.  **Read URLs:** Get the itinerary URLs from the `itineraries.json` file in the project root.
2.  **Browser Setup:** Use Playwright (Node.js/TypeScript) to launch a headless browser.
3.  **Capture:** Navigate to each URL (Live Site: `https://feeljapanwithk.com`), wait for images/fonts to load, and save as a continuous PDF locally to `dist/brochures/`.
4.  **Watermark:** Use `pdf-lib` to overlay `public/logo_transparent.png` on the bottom-right of the PDF. Position it at `y=130` to ensure it sits elegantly just above the footer section.
5. **Upload:** Upload the final watermarked PDFs to the Supabase Storage bucket named `brochures`.
6. **Icon Fidelity:** Ensure the Premium Icon System (colored PNG icons) is fully loaded before capture to maintain the "Zen Luxury" aesthetic.


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
3. **Snippets (Thumbnails):**
   - **Local Location:** `dist/brochures/thumbnails/`
   - **Supabase Bucket Path:** `thumbnails/`
   - **Naming:** `${category}_${slug}_thumb.png`
   - **Content:** High-res snippet of the brochure's first page for the Partner Library.

# Usage
Run the skill using:
```bash
npx tsx .agent/skills/brochure-capture/scripts/capture.ts
```
To force re-capture existing PDFs:
```bash
npx tsx .agent/skills/brochure-capture/scripts/capture.ts --force
```

# Brand-Clean UI Rules (Mandatory)
To maintain a high-end professional appearance, the following UI elements MUST be hidden or modified via CSS injection during capture:
1. **Branding Only (Header):** Keep the Header (Logo), but hide all navigation tabs (Home, Portfolio, etc.) and login buttons.
2. **Complete Footer:** Keep the Footer (Logo, HQ Address, and Contact Specialist details). ONLY hide the "4-page tab" navigation links (Studio Portal, Partner Library, Privacy, and Terms).
3. **Hide Interactions:** Completely hide the "Request Quote" buttons, WhatsApp floating bubbles, and Agent Rate toggle buttons.
4. **Hero Vibrancy:** Avoid heavy black tints. Use a translucent gradient (max 30% intensity at edges) and apply a `brightness(1.1)` filter to hero images to make them "exciting" and attractive.
5. **Readability:** Maintain high-contrast text shadows on all white typography over hero images to ensure readability without sacrificing image brightness.
6. **Premium Icons:** The itinerary uses a specific set of colored PNG icons (located in `public/icon/`). Ensure these are not replaced by standard monochrome icons. In PDFs, these should appear vibrant and clearly legible at 32x32px.
7. **Thumbnail Clipping:** Thumbnails should be captured at 1200x1200px to focus on the brand identity and title without showing the itinerary body.

# Constraints
- Do not re-capture if a PDF already exists locally unless the `--force` flag is used.
- Ensure the PDF filename matches the `${category}_${slug}` pattern.
- Ensure the Supabase Storage bucket `brochures` exists and uses the specified folder paths.
- **Strict Adherence:** All generated PDFs and Thumbnails must follow the Brand-Clean and Vibrancy rules above.

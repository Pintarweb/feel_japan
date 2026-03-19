# Pro Translator Skill (Azure + Supabase + Flags)
**Description:** Implements a professional-grade, white-label translation system using Azure Translator API, Supabase Edge Functions, and a Flag-based UI.

## Context
Use this when the user asks to "add translation," "make the site multilingual," or "add a flag switcher."

## Instructions

### 1. Backend & Security (Supabase)
- **Edge Function:** Create a Supabase Edge Function `translate-proxy` to call the Azure Translator API.
- **Secrets:** Remind the user to run `supabase secrets set AZURE_TRANSLATOR_KEY=...` and `AZURE_REGION=...`.
- **Persistence:** If a user is logged in, save their `language_preference` to the `profiles` table in Supabase.

### 2. UI & Design (Flags)
- **Library:** Use `country-flag-icons` (React) or high-quality SVG sprites.
- **Components:** - Build a `LanguageSwitcher.tsx` component using Tailwind CSS.
  - **Layout:** Circular flags with a dropdown or a floating "Speed Dial" button.
  - **Styles:** Use `rounded-full`, `shadow-md`, and `hover:scale-105 transition-all`.
- **Mapping:**
  - `MY` -> Bahasa Malaysia
  - `JP` -> Japanese
  - `US` -> English

### 3. Implementation Logic
- **Client-side:** Use a lightweight `TranslationContext` or `Zustand` store to track the current language.
- **DOM Walking:** On language change, scan the visible text nodes and send them to the `translate-proxy` edge function.
- **Cache:** Store translated strings in `localStorage` to minimize API calls and stay within the 2M free character limit.

### 4. Verification
- Use the **Browser Agent** to confirm:
  1. The flag icons render correctly in the navbar/footer.
  2. Clicking a flag triggers the translation overlay.
  3. The chosen language persists after a page refresh.
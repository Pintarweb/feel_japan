# Feel Japan v2 — Remix on Cloudflare: Design Document

**Date:** 2026-08-11
**Author:** Yusmarin
**Status:** Draft — Pending Review

---

## 1. Overview

Migrate the Feel Japan with K B2B travel platform from **Vercel + Supabase** to **Cloudflare ecosystem** (Pages, Workers, D1, R2, Queues, Browser Rendering), with three new capabilities: automated PDF generation, WhatsApp inquiry bot, and full data capture for marketing.

**Current state:**
- Next.js 16 App Router on Vercel
- Supabase (PostgreSQL, Auth, Storage)
- Agent portal built but not activated (0 users)
- PDF capture works locally only
- No chatbot, no analytics, no PDPA consent

**Target state:**
- Remix on Cloudflare Pages
- D1 (SQLite) + R2 + Queues
- PDF generation fully automated via Browser Rendering Workers
- WhatsApp inquiry assistant bot (separate Worker)
- Full analytics + contact capture + PDPA compliance
- Agent auth deferred to future phase

---

## 2. Architecture

```
                      feeljapanwithk.com
                             │
              ┌──────────────┴──────────────┐
              │                             │
     Cloudflare Pages                  Cloudflare Worker
        (Remix SSR)                  (WhatsApp Bot)
              │                             │
    ┌─────────┼─────────┐          ┌───────┴───────┐
    │         │         │          │               │
   D1        R2      Queues       D1          WhatsApp
 (SQLite)  (Files)  (Async)    (convs)      Cloud API
              │         │
              │    ┌────┴────┐
              │    │         │
              │  Email    PDF Gen
              │ (Resend) (Browser
              │          Rendering)
```

- **Hosting**: Cloudflare Pages (Remix SSR + static assets)
- **Database**: D1 + Drizzle ORM (all persistence)
- **Storage**: R2 (PDFs, thumbnails, images)
- **Async jobs**: Cloudflare Queues (email, PDF generation)
- **PDF generation**: Browser Rendering Workers (automated brochure capture)
- **Email**: Resend + React Email (inquiry notifications, marketing)
- **WhatsApp**: Cloudflare Worker + WABA (bot webhook handler)
- **Analytics**: Self-hosted via D1 (page views, brochure engagement)
- **Auth (admin)**: Cloudflare Access (Manage Studio protection)
- **Auth (agent)**: Deferred — magic-link via Workers + Resend
- **SEO**: Remix resource routes for sitemap.xml, robots.txt, JSON-LD per page

---

## 3. Database Design (D1 + Drizzle)

### Tables

**brochures** — Brochure catalog
```
id              TEXT PK
slug            TEXT UNIQUE
title           TEXT
subtitle        TEXT
summary         TEXT
category        TEXT      -- 'FIT'|'GIT'|'Corporate'|'Seasonal'
city            TEXT      -- JSON array as TEXT
image           TEXT      -- R2 URL
thumbnail_url   TEXT
tags            TEXT      -- JSON {type, pax}
highlights      TEXT      -- JSON array
itinerary       TEXT      -- JSON array of ItineraryDay
pricing         TEXT      -- JSON {title, tiers[], surchargeNote}
inclusions      TEXT      -- JSON array
exclusions      TEXT      -- JSON array
optional        TEXT      -- JSON array
payment_terms   TEXT      -- JSON {deposit, finalPayment}
campaign_start  TEXT
campaign_end    TEXT
is_archived     INT DEFAULT 0
show_pricing    INT DEFAULT 0
content_hash    TEXT      -- SHA256 for change detection
pdf_generated_at TEXT    -- Set after successful PDF generation
schema_type     TEXT      -- SEO: 'Tour'|'TouristAttraction'
seo_title       TEXT
seo_desc        TEXT
created_at      TEXT DEFAULT (datetime('now'))
updated_at      TEXT
```

**inquiries** — B2B travel inquiries with pipeline
```
id              TEXT PK
brochure_slug   TEXT
pax             INT
adults          INT
children_cwb    INT
children_cnb    INT DEFAULT 0
infants         INT
travel_dates    TEXT
room_category   TEXT
places          TEXT
budget          TEXT
special_request TEXT
agent_id        TEXT      -- FK to agents (nullable)
guest_name      TEXT
guest_email     TEXT
guest_agency    TEXT
guest_license   TEXT
guest_phone     TEXT
newsletter_ok   INT DEFAULT 0
source          TEXT      -- 'website'|'whatsapp'|'referral'
pipeline_status TEXT DEFAULT 'new'
                -- 'new'|'contacted'|'qualified'|'converted'|'lost'
notes           TEXT
created_at      TEXT
updated_at      TEXT
```

**contacts** — Marketing data capture (NEW)
```
id              TEXT PK
name            TEXT
email           TEXT
phone           TEXT
agency          TEXT
country         TEXT
source          TEXT      -- 'inquiry'|'whatsapp'|'partner-resources'|'newsletter'
tags            TEXT      -- JSON array of interests
consent_inquiry    INT   -- PDPA consent for inquiry processing
consent_marketing  INT   -- Separate consent for newsletter/marketing
consent_given_at   TEXT
consent_ip         TEXT  -- Audit trail
created_at      TEXT
```

**pricing_requests** — Partner rate access requests
```
id              TEXT PK
company_name    TEXT
contact_name    TEXT
email           TEXT
brochure_slug   TEXT
created_at      TEXT
```

**agents** — Agent profiles (simplified, no Supabase Auth dependency)
```
id              TEXT PK
email           TEXT UNIQUE
password_hash   TEXT      -- Deferred (magic-link auth when activated)
full_name       TEXT
agency_name     TEXT
license_no      TEXT
phone           TEXT
is_verified     INT DEFAULT 0
created_at      TEXT
```

**analytics_events** — Site + funnel tracking (NEW)
```
id              TEXT PK
event           TEXT      -- 'page_view'|'brochure_view'|'pdf_download'|'inquiry_start'|'inquiry_submit'
path            TEXT
brochure        TEXT      -- slug if brochure-related
referrer        TEXT
country         TEXT      -- From CF-IPCountry header
device          TEXT
session_id      TEXT
created_at      TEXT
```

**whatsapp_conversations** — Bot conversation history (NEW)
```
id              TEXT PK
phone           TEXT
role            TEXT      -- 'user'|'assistant'
message         TEXT
intent          TEXT
created_at      TEXT
```

### SQLite Considerations

- JSON fields stored as TEXT, parsed in application layer via `JSON.parse()`
- No JSONB indexing — acceptable at <100 brochure scale
- No array columns — `city` stored as JSON string
- No GIN indexes — not needed at this volume
- All filtering/search on JSON fields done in JS after row retrieval

---

## 4. Route Map

| Remix Route | Corresponds to | Notes |
|-------------|---------------|-------|
| `_index.tsx` | `/` (Homepage) | Hero, Features, BrochureGrid |
| `about.tsx` | `/about` | About page |
| `contact.tsx` | `/contact` | Contact + GMB map + form |
| `terms.tsx` | `/terms` | Terms & conditions |
| `privacy.tsx` | `/privacy` | Privacy + PDPA notice |
| `brochures.$slug.tsx` | `/brochures/[slug]` | Detail with JSON-LD schema |
| `partner-resources.tsx` | `/partner-resources` | Agent brochure library |
| `inquire.tsx` | `/inquire` | Inquiry form with PDPA consent |
| `bulletin.tsx` | `/bulletin` | Japan travel news |
| `review.tsx` | `/review` | Reviews with aggregateRating |
| `[city]-tours.tsx` | **NEW** | Programmatic SEO city hubs |
| `sitemap[.]xml.tsx` | **NEW** | Dynamic sitemap |
| `robots[.]txt.tsx` | **NEW** | Dynamic robots.txt |
| `manage-studio/_layout.tsx` | Manage Studio shell | Cloudflare Access guard |
| `manage-studio._index.tsx` | Dashboard | Analytics + stats |
| `manage-studio.brochures.tsx` | Brochure list | CRUD |
| `manage-studio.brochures.$id.tsx` | Studio Builder | **Merged** — create + edit in one route |
| `manage-studio.archive.tsx` | Archive | Restore + permanent delete |
| `manage-studio.inquiries.tsx` | Inquiry pipeline | Status tracking |
| `manage-studio.verify.tsx` | Agent verification | MOTAC checks |
| `manage-studio.planner.tsx` | FIT planner | |
| `agent/login.tsx` | Agent login | **Deferred** |
| `agent/signup.tsx` | Agent signup | **Deferred** |
| `agent/onboarding.tsx` | Agent onboarding | **Deferred** |
| `agent/thank-you.tsx` | Thank you | **Deferred** |
| `agent/setup-password.tsx` | Password setup | **Deferred** |

### API Endpoints (Remix resource routes)

| Route | Method | Purpose |
|-------|--------|---------|
| `api/inquire.tsx` | POST | Submit inquiry → D1 + Resend emails |
| `api/pricing-request.tsx` | POST | Partner rate access request → D1 |
| `api/brochure/capture.tsx` | POST | Trigger PDF generation → Queue |
| `api/auth/signup-notification.tsx` | POST | Agent signup email → Resend |

---

## 5. PDF Generation — Fully Automated

### Flow

```
Brochure saved → Compute content_hash → Compare with D1
  ├─ Hash unchanged → SKIP ("No PDF needed")
  └─ Hash changed/new → Upsert D1 → Enqueue → Browser Rendering Worker
                                               │
                    ┌──────────────────────────┘
                    ▼
              Generate Client PDF → R2: brochure/{cat}_{slug}.pdf
              Generate Agent PDF  → R2: brochure-pricing/{cat}_{slug}_pricing.pdf
              Generate Thumbnail  → R2: thumbnails/{cat}_{slug}_thumb.png
                    │
                    ▼
              Cleanup stale files (delete non-active category prefixes)
                    │
                    ▼
              Update D1: pdf_generated_at = now()
                    │
                    ▼
              Manage Studio shows ✅ "PDF Ready"
```

### Guardrails

- **Content hash**: SHA256 of `title + itinerary + pricing + inclusions + highlights`. Only these fields trigger regeneration. Metadata changes (archive status, campaign dates, `show_pricing`) do NOT.
- **Archiving**: Never deletes R2 files. Only flips `is_archived` in D1. Restore is instant — no regeneration needed if content unchanged.
- **Stale cleanup**: After PDF upload, query all active categories for the slug from D1, delete R2 files with non-matching category prefixes. Prevents orphaned files from category changes.
- **Failure handling**: Queue retries up to 3 times. D1 records failure state. Manage Studio shows "Retry PDF" button.

---

## 6. WhatsApp Inquiry Assistant Bot

### Architecture (separate Cloudflare Worker)

```
WhatsApp Cloud API → CF Worker (/webhook)
  ├─ classifyIntent(message)
  ├─ FAQ intents: brochures, destinations, Muslim-friendly, pricing approach
  ├─ Capture: name, email, agency → D1 contacts table
  ├─ Escalate: notify owner via personal WhatsApp
  └─ Store: D1 whatsapp_conversations
```

### Intents

| Intent | Example trigger | Response |
|--------|----------------|----------|
| GREETING | "Hi", "Hello" | Menu: 1️⃣ Browse 2️⃣ Muslim-friendly 3️⃣ Pricing 4️⃣ Talk to team |
| BROWSE | "Brochure", "Tokyo" | Links to /partner-resources + matching packages |
| MUSLIM_FRIENDLY | "Halal", "Prayer" | Halal dining, prayer spaces, Wudu facilities info |
| PRICING_APPROACH | "Price", "Rate" | Net rates for verified agents only → collect agency details |
| ESCALATE | "Talk", "Help" | Name + email capture → notify owner |
| CONTACT_CAPTURE | After inquiry | "Can I have your name and agency?" → contacts table |

### Reuse from Pintarweb bot

- Intent classification + keyword matching
- D1 conversation history storage
- Suggestion blocks (1️⃣ 2️⃣ pattern)
- Owner notification on escalation
- Menu flow pattern (GREETING → sub-menus)

---

## 7. Data Capture & Analytics

### What gets tracked

| Event | Storage | Fields |
|-------|---------|--------|
| Page view | `analytics_events` | path, country, device, session_id |
| Brochure view | `analytics_events` | brochure slug |
| PDF download | `analytics_events` | brochure slug |
| Inquiry submit | `inquiries` + `contacts` + `analytics_events` | Full form data + PDPA consent |
| Pricing request | `pricing_requests` + `contacts` | Company, name, email |
| WhatsApp interaction | `contacts` + `whatsapp_conversations` | Phone, name, agency |

### Manage Studio Dashboard

- Page views: yesterday / 7 days / 30 days
- Top brochures by views
- Inquiry funnel: new → contacted → qualified → converted → lost
- Contact list with CSV export
- Newsletter sync status

### Brevo Integration

- Weekly cron job: sync `contacts WHERE consent_marketing = 1 AND NOT synced` → Brevo contact list
- New inquiry with marketing consent → immediate sync

---

## 8. PDPA Compliance

### Consent points

| Touchpoint | Consent required |
|------------|-----------------|
| Inquiry form | ☐ Inquiry processing **(required)** / ☐ Marketing updates **(optional, separate checkbox)** |
| Pricing request modal | ☐ Data processing |
| Contact form | ☐ Data processing |
| WhatsApp bot | Verbal consent before storing contact data |
| Cookie banner | Accept/decline analytics cookies |

### Privacy page sections

1. Data controller → Feel Japan with K
2. What we collect (per touchpoint, purpose)
3. Storage & protection (where, how long)
4. Third-party processors (Cloudflare, Resend, Brevo)
5. Data retention periods
6. User rights: access, correct, withdraw, delete
7. DPO contact
8. PDPA compliance statement

### D1 schema for audit trail
- `contacts.consent_inquiry` / `consent_marketing` (boolean)
- `contacts.consent_given_at` (timestamp)
- `contacts.consent_ip` (IP at time of consent)

---

## 9. SEO / AEO / GMB

### Schema.org (JSON-LD) — auto-generated per route

| Page | Schema type |
|------|------------|
| Home | `TourOperator` + `aggregateRating` |
| Brochure detail | `TouristAttraction` or `Tour` with itinerary, Muslim-friendly markers |
| Contact | `LocalBusiness` with address, phone, geo |
| Review | `aggregateRating` with `Review` items |
| FAQ sections | `FAQPage` (Google featured snippet eligible) |
| All pages | `BreadcrumbList` |

### Programmatic SEO

- `/[city]-tours.tsx` — auto-generates city hub pages from D1
- Title: "{City} Group Tours & Packages for Travel Agents | Feel Japan with K"
- Lists all brochures for that city with agent-focused descriptions
- Auto-included in sitemap.xml

### B2B Keyword Strategy

- Primary: "Japan DMC," "wholesale Japan tours," "Japan land arrangement," "Muslim-friendly Japan operator"
- City-level: "{City} group itineraries," "{City} corporate incentive packages"
- AEO: "How to find reliable Japan DMC," "Japan net rate vs published rate," "Muslim group tour Japan prayer facilities"

### GMB

- Google Business Profile listing for Feel Japan with K
- Review feed displayed on website
- Map embed on contact page

---

## 10. Authentication

| Tier | Access | Method |
|------|--------|--------|
| Public | Home, brochures, partner-resources, contact, about, terms, privacy, bulletin, review | None |
| Admin | Manage Studio | Cloudflare Access (password + optional IP whitelist) |
| Agent | Agent portal (deferred) | Custom magic-link via Workers + Resend |

### Agent auth (future)
When agent portal is activated:
- `/agent/signup` → create agent record in D1 with MOTAC license
- `/agent/login` → email magic-link → Workers validates → JWT cookie
- Middleware checks agent cookie on `/agent/*` routes
- Same pattern extensible to `/manage-studio/*` if Cloudflare Access is insufficient

---

## 11. Deployment & Migration Plan

### wrangler.toml (skeleton)
```toml
name = "feel-japan"
main = "build/server/index.js"
compatibility_date = "2026-08-01"

[[d1_databases]]
binding = "DB"
database_name = "feel-japan-db"

[[r2_buckets]]
binding = "R2"
bucket_name = "feel-japan-assets"

[[queues.producers]]
binding = "QUEUE"
queue = "feel-japan-queue"

[[queues.consumers]]
queue = "feel-japan-queue"
max_retries = 3

[vars]
RESEND_API_KEY = "..."
SUPPORT_EMAIL = "inquiry@feeljapanwithk.com"
WHATSAPP_NUMBER = "+60196556243"
```

### Phases

**Phase 0 — Setup (Day 1)**
- New GitHub repo: `Pintarweb/feel-japan-cf`
- Design doc committed

**Phase 1 — Foundation (Week 1)**
- Scaffold Remix + Cloudflare (wrangler, D1, R2, Queues)
- Drizzle schema + migrations (all 7 tables)
- Design system port (Tailwind, fonts, color tokens)
- Layout components (Navbar, Footer)

**Phase 2 — Public Pages (Week 1-2)**
- Homepage, About, Contact, Terms, Privacy (PDPA)
- Brochure detail pages with JSON-LD schema
- Partner Resources grid with download buttons
- Inquiry form with PDPA consent checkboxes
- Bulletin, Review pages
- Programmatic SEO city hubs + sitemap + robots.txt

**Phase 3 — Manage Studio (Week 2)**
- Dashboard with analytics (page views, top brochures, inquiry funnel)
- Brochure CRUD + inline editor (merged create/edit)
- Archive with restore
- Inquiry pipeline with status tracking
- Cloudflare Access admin auth

**Phase 4 — PDF + WhatsApp (Week 2-3)**
- Browser Rendering Worker for PDF capture
- Content hash guardrail + stale file cleanup
- WhatsApp bot Worker (intents, FAQ, contact capture)
- Deploy both Workers + end-to-end test

**Phase 5 — Data Migration (Week 3)**
- Export Supabase data → seed D1
- Copy Supabase Storage files → R2
- Test all forms, emails, PDFs, bot

**Phase 6 — Go-Live (Week 3-4)**
- DNS cutover: feeljapanwithk.com → Cloudflare
- 48h monitoring with Vercel fallback
- Archive old repo + Vercel + Supabase projects

### Rollback plan
- DNS revert to Vercel (instant via Cloudflare dashboard)
- R2 → Supabase Storage re-sync (files exist in both during migration window)

---

## 12. Project Structure

```
feel-japan-cf/
├── app/
│   ├── routes/
│   │   ├── _index.tsx              # Homepage
│   │   ├── about.tsx
│   │   ├── contact.tsx
│   │   ├── terms.tsx
│   │   ├── privacy.tsx
│   │   ├── brochures.$slug.tsx
│   │   ├── partner-resources.tsx
│   │   ├── inquire.tsx
│   │   ├── bulletin.tsx
│   │   ├── review.tsx
│   │   ├── [city]-tours.tsx        # Programmatic SEO
│   │   ├── sitemap[.]xml.tsx
│   │   ├── robots[.]txt.tsx
│   │   ├── agent/                  # Deferred
│   │   │   ├── login.tsx
│   │   │   ├── signup.tsx
│   │   │   ├── onboarding.tsx
│   │   │   ├── thank-you.tsx
│   │   │   └── setup-password.tsx
│   │   ├── manage-studio/
│   │   │   ├── _layout.tsx         # Admin shell + CF Access
│   │   │   ├── _index.tsx          # Dashboard
│   │   │   ├── brochures.tsx
│   │   │   ├── brochures.$id.tsx   # Editor
│   │   │   ├── archive.tsx
│   │   │   ├── inquiries.tsx
│   │   │   ├── verify.tsx
│   │   │   └── planner.tsx
│   │   └── api/
│   │       ├── inquire.tsx
│   │       ├── pricing-request.tsx
│   │       ├── brochure.capture.tsx
│   │       └── auth.signup-notification.tsx
│   ├── root.tsx
│   └── entry.server.tsx
├── app/
│   ├── components/                 # Ported React components
│   │   ├── layout/                 # Navbar, Footer, BottomNav
│   │   ├── sections/               # Hero, BrochureGrid, BrochureTemplate, InquiryForm, etc.
│   │   ├── shared/                 # CurrencyWidget, WeatherWidget, ComingSoon
│   │   └── studio/                 # Builder tabs, Gatekeeper
│   ├── lib/
│   │   ├── db.server.ts            # D1 + Drizzle client
│   │   ├── r2.server.ts            # R2 helpers
│   │   ├── queue.server.ts         # Queue producers
│   │   ├── email.server.ts         # Resend + React Email
│   │   ├── analytics.server.ts     # Track event → D1
│   │   ├── seo.server.ts           # JSON-LD generators
│   │   ├── auth.server.ts          # Agent auth (deferred)
│   │   └── utils.ts
│   ├── drizzle/
│   │   ├── schema.ts
│   │   └── migrations/
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── tailwind.css
├── workers/
│   └── whatsapp-bot/
│       ├── index.ts                # Webhook handler
│       ├── bot-logic.ts            # Intent classification
│       └── kb.ts                   # Travel FAQ knowledge base
├── scripts/
│   ├── seed.ts
│   └── capture-local.ts            # Local PDF fallback
├── public/
│   ├── images/
│   └── favicon.ico
├── drizzle.config.ts
├── wrangler.toml
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 13. Deferred Items (YAGNI)

| Feature | Why not now |
|---------|-------------|
| Agent portal auth | 0 active agents, build when needed |
| Agent onboarding flow | All 5 agent routes deferred |
| Online booking/payment | Not in scope, inquiry-only model |
| Real-time chat (non-WhatsApp) | WhatsApp bot covers the use case |
| Multi-language (BM/JP) | English-first for B2B, add later |
| CI/CD beyond wrangler deploy | Manual deploy is fine at this scale |

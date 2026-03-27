# AGENTS.md — AI Agent Technical Reference

> **Project:** Empower Your Core (empoweryourcore.nl)
> **Architecture:** Next.js 15 + Framer Hybrid | TypeScript | Vercel Edge
> **Last updated:** 2026-03-27

---

## 1. Project Overview

Empower Your Core is a production-grade website for a premium Pilates studio in Utrecht, Netherlands. The architecture combines **Framer** (visual design layer) with **Next.js 15** (server rendering, routing, API) to deliver a fast, bilingual, pixel-perfect experience.

**Key stats:**
- 12,641 lines of production code
- 14 pages (homepage, 6 case studies, pricing, contact, method, training, about)
- 350+ Dutch/English translation mappings
- 4 responsive breakpoints
- Sub-second global TTFB via Vercel Edge Network

---

## 2. Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Server Framework** | Next.js 15.5.9 (App Router) | SSR, static generation, API routes, file-based routing |
| **UI Library** | React 19.1.2 | Component rendering, hydration |
| **Type System** | TypeScript 5.x | Type safety across the codebase |
| **CSS Framework** | Tailwind CSS 4.x | Utility-first styling |
| **Runtime Engine** | Custom JavaScript (4,629 LOC) | DOM manipulation, i18n, responsive CSS injection |
| **Email Service** | Resend 6.9.4 | Transactional email delivery (contact form) |
| **Hosting** | Vercel (Edge Network) | Global CDN, automatic HTTPS, edge functions |
| **Package Manager** | Yarn 4.9.1 | Dependency management |
| **Design System** | Framer (exported) | Visual design layer, page templates |

---

## 3. Architecture

### Rendering Pipeline

```
Browser Request
      |
  Vercel Edge CDN (cached response or origin fetch)
      |
  Next.js App Router
      |
  FramerIframe.tsx (React Server Component)
      |
  Renders Framer HTML inside sandboxed iframe
      |
  translate.js loads inside iframe:
    1. Language detection (localStorage)
    2. DOM transformations (text, structure, branding)
    3. CSS injection (responsive alignment, typography)
    4. Video initialization (hero + outro)
    5. Translation sweep (NL -> EN if toggled)
```

### Why This Architecture?

- **Framer** provides designer-quality visual output with complex animations and layouts
- **Next.js** adds SSR (SEO), server-side API routes (contact form), and TypeScript safety
- **FramerIframe** bridges the two: serves static Framer HTML while Next.js handles routing and metadata
- **translate.js** is the runtime engine that transforms Framer's raw output into the final experience (translations, responsive fixes, brand enforcement)

---

## 4. File Structure

### Source Code (`src/`)

| File | Lines | Purpose |
|------|-------|---------|
| `app/layout.tsx` | 71 | Root layout: HTML head, fonts (Inter, Playfair), metadata |
| `app/page.tsx` | 5 | Homepage — renders FramerIframe with `index.html` |
| `app/components/FramerIframe.tsx` | 90 | Core component: iframe wrapper with responsive resize, error handling |
| `app/api/contact/route.ts` | 60 | POST endpoint: parses form data, sends email via Resend |
| `app/works/[slug]/page.tsx` | 28 | Dynamic routing for case study pages |
| `app/globals.css` | 220 | Global styles, Tailwind imports, iframe base styles |

### Runtime Engine (`public/translate.js`)

| Module | Purpose |
|--------|---------|
| `ensureHomeDocxIntroStyle()` | Hero section: intro card, kicker pills, CTA button |
| `ensureHowWeWorkStyles()` | "Hoe wij werken" grid layout, step cards |
| `ensureHomeBenefitVideoStyles()` | Benefit section spacing, width alignment system |
| `ensureCaseStudyHeroTitleStyles()` | Case study page hero titles |
| `ensureResponsiveLayoutStyles()` | Cross-section responsive CSS (mobile/tablet/desktop) |
| `interceptContactForm()` | Contact form DOM interception → `/api/contact` |
| `injectLangToggle()` | NL/EN language toggle (inside nav flex row) |
| `enforceRegisteredBranding()` | Trademark enforcement (Empower Your Core, EYC) |
| `framerCdnBlocker()` | Blocks external Framer CDN asset requests |

### Static Pages (`public/`)

| Page | File | Lines |
|------|------|-------|
| Homepage | `index.html` | 622 |
| Contact | `contact.html` | 584 |
| Pricing | `pricing.html` | 582 |
| Personal Training | `works/personal-training.html` | 648 |
| Our Method | `works/our-method.html` | 566 |
| Teacher Training | `works/teacher-training.html` | 554 |
| About Us | `works/about-us.html` | 550 |
| 6 Case Studies | `works/*.html` | ~600 each |

---

## 5. Responsive Design System

The layout uses a **mathematical alignment system** with the hero card as the width reference:

| Breakpoint | Viewport | Content Width | Side Margin |
|------------|----------|---------------|-------------|
| Mobile | < 810px | `calc(100vw - 65px)` | 32.5px |
| Tablet | 810px - 1023px | `min(980px, 100%)` | 64px padding |
| Desktop | 1024px+ | 980px max | 64px padding |

**Key principle:** All sections (benefit, how-we-work, testimonials, footer) must align to the hero card edges. The runtime engine enforces this via CSS injection.

---

## 6. Bilingual System (NL/EN)

- **Storage:** `localStorage` key `eyc-lang` (`"nl"` or `"en"`)
- **Toggle:** 40x40px button inside the navigation bar, grouped with hamburger menu
- **Translation:** 350+ entries in `nlToEnMap` object within translate.js
- **Mechanism:** On page load, if `eyc-lang === "en"`, a text node walker replaces Dutch strings with English equivalents
- **Scope:** All visible text including headings, paragraphs, buttons, navigation, footer

### Changing the Default Language

The default language is set on **line 58** of `public/translate.js`:

```js
// Line 53-59 of public/translate.js
var eycLang = (function() {
    try {
      var stored = localStorage.getItem(EYC_LANG_KEY);
      if (stored === "en" || stored === "nl") return stored;
    } catch(e) {}
    return "nl";   // ← Change to "en" for English default
})();
```

- If the user has previously chosen a language via the toggle, `localStorage` wins
- If no preference is stored (first visit), the fallback value on line 58 is used
- To make the site English by default: change `return "nl"` to `return "en"`
- No other files need to change — the toggle, translations, and DOM walker all adapt automatically

### Language-Dependent Social Links

The Instagram link changes based on the active language (line ~837 of `translate.js`):

| Language | Instagram Profile |
|----------|-------------------|
| NL (Dutch) | [instagram.com/empoweryourcore.nl](https://www.instagram.com/empoweryourcore.nl/) |
| EN (English) | [instagram.com/empowerbymo](https://www.instagram.com/empowerbymo/) |

This is automatic — no manual switching needed. When the language changes, all Instagram links on the site update accordingly.

---

## 7. Contact Form Architecture

```
User submits form (Framer HTML)
      |
  interceptContactForm() captures submit event
      |
  Extracts fields from DOM: name, email, phone, message
      |
  POST /api/contact (Next.js API route)
      |
  route.ts validates fields
      |
  Resend API sends email to studio
      |
  Returns success/error to client
```

**Required environment variable:** `RESEND_API_KEY`

**Setup:** Create a free account at [resend.com](https://resend.com) (3,000 emails/month free tier), verify the domain `empoweryourcore.nl`, generate an API key, and add it as `RESEND_API_KEY` in Vercel environment variables. Full step-by-step guide in README.md.

**Recipient address:** Configured in `src/app/api/contact/route.ts` in the `to:` field of the Resend API call.

---

## 8. Development Commands

```bash
yarn install          # Install all dependencies
yarn dev              # Development server (port 3000, hot reload)
yarn build            # Production build (static generation + SSR)
yarn start            # Start production server
npx vercel --prod     # Deploy to Vercel production
```

---

## 9. Cache Management

`translate.js` is the most frequently updated file. To bypass browser caching after changes:

1. Update the version string in all HTML files:
   ```html
   <script src="/translate.js?v=YYYY-MM-DD-vX" defer></script>
   ```
2. `next.config.ts` sets `Cache-Control: no-cache` headers for translate.js
3. `vercel.json` sets no-cache headers for HTML files

---

## 10. Deployment Pipeline

**Recommended stack:** GitHub (version control) + Vercel (hosting) — both free tier.

```
git push origin main  →  Vercel webhook  →  Auto build + deploy  →  Live (< 60s)
```

**Setup:**
1. Push this repo to a private GitHub repository
2. Connect the repo to Vercel at vercel.com
3. Add `RESEND_API_KEY` as an environment variable in Vercel dashboard
4. Point `empoweryourcore.nl` DNS to Vercel nameservers
5. Enable automatic deployments (Vercel deploys on every push to `main`)

**Current `vercel.json` setting:** `git.deploymentEnabled: false` — change to `true` to enable auto-deploy on push. Or keep `false` for manual-only deploys via `npx vercel --prod`.

**Headers configured:**
- `translate.js`: `no-cache, no-store, must-revalidate`
- `*.html`: `no-cache, no-store, must-revalidate`

---

## 11. Video Assets

| File | Location | Purpose |
|------|----------|---------|
| `Intro_Video.mp4` | `public/assets/` | Hero section background video |
| `Outro_Video.mp4` | `public/assets/` | Footer section background video |

**Note:** These files are large and may be gitignored. Verify they exist in `public/assets/` before building or deploying.

---

## 12. Maintenance Guide

### Adding a New Case Study Page

1. Export the page from Framer as static HTML
2. Save to `public/works/new-page-name.html`
3. Add the slug to the route map in `src/app/works/[slug]/page.tsx`
4. Add Dutch text entries to `nlToEnMap` in `translate.js` for English support
5. Update the version string in the new HTML file's script tag

### Updating Translations

1. Open `public/translate.js`
2. Find the `nlToEnMap` object (~line 60)
3. Add new Dutch → English key-value pairs
4. Bump the version string in all HTML files

### Modifying Styles

The runtime engine injects CSS via JavaScript functions (Section 4 above). Each function targets specific page sections. Modify the relevant function and bump the version string.

---

## 13. Known Considerations

1. **Framer Class Selectors**: Framer generates hashed class names (e.g., `.framer-1pxw2q4`). These may change if pages are re-exported from Framer — verify CSS selectors after re-exports.
2. **Video Autoplay**: Mobile browsers restrict autoplay. Videos are muted by default and use the `playsinline` attribute.
3. **YouTube Embeds**: Case study pages with YouTube videos require `pointer-events: auto` and `opacity: 1` overrides due to Framer's default styling.
4. **Dual Update Requirement**: When updating text content, both the HTML template AND `translate.js` translation map must be updated to maintain NL/EN consistency.

---

## License

All rights reserved. This codebase is the exclusive intellectual property of **Empower Your Core** (empoweryourcore.nl).

Copyright 2025-2026 Empower Your Core.

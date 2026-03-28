# Empower Your Core - Technical Handover

**empoweryourcore.nl** | Pilates Studio Utrecht

---

## Overview

Technical handover and maintenance guide for the Empower Your Core website. The project combines exported Framer layouts with a Next.js 15 application layer to deliver fast rendering, bilingual content management, and precise responsive behavior across mobile, tablet, and desktop.

In this English handover repository, the homepage has already been partially hardened so the final production-facing structure for the premium intro, benefit video, process section, and studio clips lives directly in `public/index.html`.

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 15.5.9 |
| **UI Library** | React | 19.1.2 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS + Custom CSS Engine | 4.x |
| **Email Service** | Resend (transactional email API) | 6.9.4 |
| **Deployment** | Vercel (Edge Network, global CDN) | - |
| **Package Manager** | Yarn | 4.9.1 |
| **Design System** | Framer (exported, customized) | - |

---

## Project Snapshot

| Item | Status |
|------|--------|
| Public site pages | 14 routes |
| Static Framer templates | 13 HTML templates |
| Runtime engine | `public/translate.js` with 4,700+ lines |
| Translation coverage | 350+ Dutch/English mappings |
| Responsive system | 4 breakpoints |
| Contact delivery | `Resend` via `src/app/api/contact/route.ts` |
| Primary hosting target | Vercel |
| Homepage hardening | Core EN homepage sections baked into `public/index.html` |

---

## Architecture

```
                    Vercel Edge Network (Global CDN)
                              |
                     Next.js 15 App Router
                       /              \
              Server Components     API Routes
              (SSR + Static)        (/api/contact)
                    |                     |
            FramerIframe.tsx         Resend Email
            (Hydration layer)         Service
                    |
           Framer HTML Templates
           (13 static templates)
                    |
          translate.js Runtime Support Layer
          (i18n, responsive CSS,
           branding, targeted DOM fixes)
```

### Key Architectural Decisions

1. **Hybrid Rendering**: Framer's design-first visual output is wrapped in Next.js server components, giving us the best of both worlds — designer-quality visuals with enterprise-grade SSR, routing, and API capabilities.

2. **Runtime Support Layer**: `public/translate.js` handles bilingual content, responsive CSS injection, brand consistency enforcement, and targeted DOM fixes. In this English handover repo, the homepage's main premium sections are already stored in the base HTML to reduce runtime fragility.

3. **Zero-Layout-Shift Design**: Custom CSS override system ensures pixel-perfect alignment across all viewport sizes. The hero card serves as the width reference (32.5px margin on mobile, 64px on desktop), with all sections mathematically aligned.

4. **Edge Deployment**: Vercel's global CDN with no-cache headers on dynamic assets ensures instant propagation of content updates worldwide.

---

## Project Structure

```
empoweryourcore.nl/
|-- src/
|   |-- app/
|   |   |-- api/contact/route.ts    # Contact form API (Resend integration)
|   |   |-- components/
|   |   |   +-- FramerIframe.tsx     # Hydration wrapper component
|   |   |-- layout.tsx              # Root layout (metadata, fonts, SEO)
|   |   |-- page.tsx                # Homepage
|   |   |-- contact/page.tsx        # Contact page
|   |   |-- pricing/page.tsx        # Pricing page
|   |   |-- works/page.tsx          # Experiences index
|   |   +-- works/[slug]/page.tsx   # Dynamic case study routing
|   +-- globals.css                 # Global styles + Tailwind
|-- public/
|   |-- index.html                  # Homepage template with hardened EN premium sections
|   |-- contact.html                # Contact form template
|   |-- pricing.html                # Pricing template
|   |-- translate.js                # Runtime support layer (i18n + responsive CSS + targeted fixes)
|   |-- assets/                     # Video assets (Intro/Outro)
|   +-- works/                      # 10 case study pages
|-- next.config.ts                  # Cache control headers
|-- vercel.json                     # Deployment configuration
+-- tsconfig.json                   # TypeScript configuration
```

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero video, services overview, testimonials carousel |
| Personal Training | `/works/personal-training` | Private session offerings |
| Method | `/works/our-method` | Training methodology & philosophy |
| Teacher Training | `/works/teacher-training` | Instructor certification program |
| Experiences | `/works/*` | 6 client transformation stories |
| Pricing | `/pricing` | Service packages and rates |
| Contact | `/contact` | Contact form with email integration |
| About Us | `/works/about-us` | Studio and team information |

---

## Features

- **Bilingual Support (NL/EN)**: Full Dutch/English toggle with 350+ translation mappings, localStorage persistence, and zero-reload switching
- **Responsive Design**: Mathematically aligned layout system across mobile (375px), tablet (768px), desktop (1280px+)
- **Video Integration**: Autoplay hero and outro videos with graceful fallbacks
- **Contact Form**: Server-side email delivery via Resend API with field validation
- **SEO Optimized**: Server-rendered meta tags, Open Graph data, structured markup
- **Performance**: Static generation + edge caching = sub-second TTFB globally
- **Brand Consistency**: Automated enforcement of registered trademarks (Empower Your Core, EYC)
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support
- **Homepage Hardening**: The EN homepage intro, benefit video, process section, and studio clips are stored directly in the base HTML rather than rebuilt on every load

---

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Production build
yarn build

# Start production server
yarn start
```

### Local Preview Workflow

- Use `yarn dev` for day-to-day editing and route checks
- Use `yarn build` before handoff or deployment validation
- Use `yarn start` after a successful build when you want a production-like local preview
- `next.config.ts` disables the unstable `devtoolSegmentExplorer` experiment to keep local previews reliable in Next.js 15
- When checking Framer pages locally, validate the iframe-rendered page itself, not only the outer Next.js wrapper

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | Email delivery for contact form | Yes |

### Contact Form Setup (Resend — Free)

The contact form sends emails via [Resend](https://resend.com), a modern email API. The **free tier includes 3,000 emails/month** — more than enough for a Pilates studio.

**Setup steps:**

1. **Create account** at [resend.com](https://resend.com) (sign up with Google or email)
2. **Verify your domain:**
   - Go to Resend dashboard → Domains → Add Domain
   - Enter `empoweryourcore.nl`
   - Add the DNS records Resend provides (MX, TXT, DKIM) in your domain registrar
   - Wait for verification (usually 5-30 minutes)
3. **Generate API key:**
   - Go to Resend dashboard → API Keys → Create API Key
   - Name it `empoweryourcore-production`
   - Copy the key (starts with `re_`)
4. **Add to Vercel:**
   - Go to [vercel.com](https://vercel.com) → your project → Settings → Environment Variables
   - Name: `RESEND_API_KEY`
   - Value: paste the `re_...` key
   - Environment: Production (and Preview if you want form testing on preview URLs)
   - Click Save
5. **Redeploy** (Vercel → Deployments → Redeploy latest)

That's it. The contact form will now deliver emails to the studio inbox. No code changes needed.

**Where emails are sent:** configured in `src/app/api/contact/route.ts` — update the `to:` address if the studio email changes.

---

## Deployment

```
Git repository
      |
 Vercel project
      |
 Build + deploy
      |
 Live site
```

### Current Configuration

`vercel.json` currently sets `"deploymentEnabled": false`, so automatic Git-based deployments are disabled by default. This means the safest current workflow is a manual production deploy.

### Setup (One-Time)

1. **GitHub**: Create a private repository and push this codebase
2. **Vercel**: Connect the GitHub repo at [vercel.com](https://vercel.com)
3. **Environment**: Add `RESEND_API_KEY` in Vercel dashboard → Settings → Environment Variables
4. **Domain**: Point `empoweryourcore.nl` DNS to Vercel (automatic HTTPS)

### Deploy

```bash
# Option A: Manual CLI (current default)
npx vercel --prod       # Direct deploy from local machine

# Option B: Automatic
# 1. Change vercel.json -> git.deploymentEnabled to true
# 2. Push to main
```

### Why GitHub + Vercel?

| Benefit | Detail |
|---------|--------|
| **Free** | Both platforms offer generous free tiers for this project size |
| **Automatic** | Available once `git.deploymentEnabled` is enabled |
| **Global CDN** | Vercel serves from 80+ edge locations worldwide |
| **Rollback** | One-click rollback to any previous deployment |
| **Preview URLs** | Every pull request gets its own preview URL for testing |
| **SSL** | Automatic HTTPS certificate provisioning and renewal |
| **Analytics** | Built-in web analytics (page views, performance metrics) |

`vercel.json` and `next.config.ts` enforce no-cache headers on `translate.js` and the static HTML entry points so content changes propagate immediately.

---

## Changing the Default Language

The site defaults to **English (EN)**. To switch the default to **Dutch**:

1. Open `public/translate.js`
2. Find **line 58**: `return "en";`
3. Change to: `return "nl";`
4. Deploy using your preferred Vercel workflow

That's the only change needed. Users who already chose a language via the toggle keep their preference (stored in browser localStorage).

---

## Cache Management

The runtime engine (`translate.js`) is loaded with a version query string for cache busting:

```html
<script src="/translate.js?v=YYYY-MM-DD-vX" defer></script>
```

Update this version string after any `translate.js` change in:

- `public/index.html`
- `public/works/*.html`

This is required to bypass browser caching after runtime text or layout changes.

For major homepage HTML changes, update the same version string as part of the release so the iframe picks up the latest HTML entry point and runtime support file together.

---

## Homepage Maintenance

For the English homepage, use a **base-first** workflow:

1. Update `public/index.html` first for visible content and structure changes
2. Only change `public/translate.js` when the update needs:
   - translation coverage
   - responsive CSS support
   - a targeted runtime fix that cannot safely live in the base HTML
3. Rebuild with `yarn build`
4. Validate with `yarn start`

This reduces the chance of legacy copy or outdated sections reappearing during hydration.

---

## License & Ownership

**All rights reserved.**

This codebase, including all source code, design implementations, translation mappings, and media assets, is the exclusive intellectual property of **Empower Your Core** (empoweryourcore.nl).

Unauthorized reproduction, distribution, or modification of any part of this project is strictly prohibited.

Copyright 2025-2026 Empower Your Core. All rights reserved.

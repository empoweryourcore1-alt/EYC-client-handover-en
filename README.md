# Empower Your Core - Production Website

**empoweryourcore.nl** | Pilates Studio Utrecht

---

## Overview

Custom-engineered, high-performance website for Empower Your Core, a premium Pilates studio in Utrecht. Built as a hybrid architecture combining a design-first visual layer with a robust server-side rendering framework, delivering sub-second load times, full bilingual support, and pixel-perfect responsive behavior across all devices.

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

## Codebase Metrics

| Metric | Count |
|--------|-------|
| **Total lines of production code** | **12,641** |
| Custom runtime engine (`translate.js`) | 4,629 lines |
| Static page templates (HTML) | 7,747 lines |
| React/TypeScript components | 265 lines |
| API routes | 60 lines |
| CSS architecture | 220 lines |
| **Page count** | 14 pages |
| **Translation mappings (NL/EN)** | 350+ entries |
| **CSS override functions** | 9 specialized modules |
| **Responsive breakpoints** | 4 (mobile, tablet, desktop, wide) |

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
           (12 static pages)
                    |
          translate.js Runtime Engine
          (4,629 lines — DOM transforms,
           i18n, responsive CSS, branding)
```

### Key Architectural Decisions

1. **Hybrid Rendering**: Framer's design-first visual output is wrapped in Next.js server components, giving us the best of both worlds — designer-quality visuals with enterprise-grade SSR, routing, and API capabilities.

2. **Runtime Translation Engine**: A custom 4,600+ line JavaScript engine handles bilingual content (Dutch/English), real-time DOM manipulation, responsive CSS injection, and brand consistency enforcement — all without page reloads.

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
|   |   +-- works/[slug]/page.tsx   # Dynamic case study routing
|   +-- globals.css                 # Global styles + Tailwind
|-- public/
|   |-- index.html                  # Homepage template
|   |-- contact.html                # Contact form template
|   |-- pricing.html                # Pricing template
|   |-- translate.js                # Runtime engine (i18n + DOM + CSS)
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

---

## Development

```bash
# Install dependencies
yarn install

# Start development server (port 3000)
yarn dev

# Production build
yarn build

# Start production server
yarn start
```

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

## Deployment Pipeline (Recommended)

**GitHub + Vercel** — both free tier, zero cost.

```
Developer pushes to GitHub
         |
  Vercel detects push (webhook)
         |
  Automatic build + deploy
         |
  Live on empoweryourcore.nl (< 60 seconds)
```

### Setup (One-Time)

1. **GitHub**: Create a private repository and push this codebase
2. **Vercel**: Connect the GitHub repo at [vercel.com](https://vercel.com)
3. **Environment**: Add `RESEND_API_KEY` in Vercel dashboard → Settings → Environment Variables
4. **Domain**: Point `empoweryourcore.nl` DNS to Vercel (automatic HTTPS)

### Deploy

```bash
# Option A: Automatic (recommended)
git push origin main    # Vercel auto-deploys on push

# Option B: Manual CLI
npx vercel --prod       # Direct deploy from local machine
```

### Why GitHub + Vercel?

| Benefit | Detail |
|---------|--------|
| **Free** | Both platforms offer generous free tiers for this project size |
| **Automatic** | Push to `main` = instant production deploy |
| **Global CDN** | Vercel serves from 80+ edge locations worldwide |
| **Rollback** | One-click rollback to any previous deployment |
| **Preview URLs** | Every pull request gets its own preview URL for testing |
| **SSL** | Automatic HTTPS certificate provisioning and renewal |
| **Analytics** | Built-in web analytics (page views, performance metrics) |

Configuration in `vercel.json` enforces no-cache headers on dynamic content to ensure instant update propagation.

---

## Changing the Default Language

The site defaults to **Dutch (NL)**. To switch the default to **English**:

1. Open `public/translate.js`
2. Find **line 58**: `return "nl";`
3. Change to: `return "en";`
4. Commit and push — Vercel auto-deploys

That's the only change needed. Users who already chose a language via the toggle keep their preference (stored in browser localStorage).

---

## Version Management

The runtime engine (`translate.js`) uses a version string in its script tag for cache busting:

```html
<script src="/translate.js?v=2026-03-25-s12" defer></script>
```

Update this version string after any changes to `translate.js` to bypass browser caching.

---

## License & Ownership

**All rights reserved.**

This codebase, including all source code, design implementations, translation mappings, and media assets, is the exclusive intellectual property of **Empower Your Core** (empoweryourcore.nl).

Unauthorized reproduction, distribution, or modification of any part of this project is strictly prohibited.

Copyright 2025-2026 Empower Your Core. All rights reserved.

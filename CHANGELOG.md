# Changelog

All notable changes to the Empower Your Core website are documented here.
This project follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Changed
- Hardened the English homepage so the premium intro, benefit video, process section, and studio clips now live in `public/index.html`
- Reduced homepage runtime generation by turning `translate.js` into a support layer for those baked sections
- Normalized the homepage `Teacher Training Program` card teaser to English-only copy for the EN handover repo

### Documentation
- Refreshed the repository handover documentation for client delivery
- Clarified the current Vercel deployment mode and local preview workflow
- Updated cache management guidance for `translate.js` versioning
- Aligned the security documentation with the headers and audit commands currently used in the project
- Documented the new HTML-first maintenance workflow for the English homepage
- Added an explicit homepage typography guardrail so `What we offer`, `How we work`, and `Hear from our clients` stay non-cursive while the intro lead lines can remain italic

---

## [1.0.0] - 2026-03-27

### Added
- Production-ready website built on Next.js 15 + React 19
- Custom runtime engine (4,629 lines) for Framer hybrid architecture
- Bilingual system (NL/EN) with 350+ translation mappings
- Contact form with Resend email API integration
- Responsive design system with mathematical alignment (hero card reference)
- Six client case study pages with dedicated layouts
- SEO-optimized Open Graph metadata for social sharing
- YouTube video integration with custom player controls
- Instagram feed integration
- Professional footer with sitemap navigation

### Architecture
- Hybrid Framer export + Next.js App Router
- Server-side rendering with static asset optimization
- Custom DOM manipulation engine for runtime content management
- CSS injection system for cross-breakpoint responsive consistency

---

## [0.9.0] - 2025-03-15

### Added
- Initial Framer design integration
- Page routing structure (Home, Personal Training, Method, Experiences, Pricing, About, Contact)
- Mobile-first responsive breakpoints (810px, 1200px, 1440px)
- Brand identity implementation (typography, color palette, logo variants)

---

## [0.8.0] - 2026-02-28

### Added
- Project scaffolding with Next.js 15
- Vercel deployment configuration
- Domain setup for empoweryourcore.nl
- SSL certificate provisioning

# Saurabh Dixit — "The Systems Blueprint" Portfolio

A high-performance, accessible, and typographic personal engineering portfolio and architecture showcase deployed at [https://www.saurabhdixit93.site](https://www.saurabhdixit93.site).

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🏛️ Design Identity: The Systems Blueprint

- **Theme System**: Dual-theme architecture — **Graphite** (`#0B0D10` dark default) and **Paper** (`#F3F0E8` light) with **Signal-Orange** accent (`#FF6A2B` / `#C8400E`) and zero flash-on-load.
- **Typography**: 
  - `Instrument Serif` (editorial display headlines with italic accents)
  - `Geist Sans` (clean UI and narrative typography)
  - `Geist Mono` (technical telemetry, commit hashes, code annotations)
- **Architectural Texture**: Hairline borders, corner registration marks (`+`), subtle blueprint grids, and mono annotations (`// 01 · ABOUT`).
- **Performance**: Pure SVG animated schematics replacing heavy Three.js WebGL canvas; First Load JS shared is only 102 kB.

---

## 📁 Repository Structure

```text
├── app/
│   ├── api/
│   │   ├── assistant/route.ts      # "Ask Saurabh" streaming retrieval engine
│   │   └── contact/route.ts        # Zod-validated contact form with honeypot & rate limiter
│   ├── dev/tokens/page.tsx         # Dev-only design tokens & component preview (/dev/tokens)
│   ├── work/[slug]/                # Static SSG dynamic case study pages & dynamic OG images
│   ├── error.tsx                   # Blueprint runtime exception boundary
│   ├── not-found.tsx               # Blueprint 404 page
│   ├── robots.ts                   # Search crawler directives
│   ├── sitemap.ts                  # Dynamic canonical sitemap
│   ├── layout.tsx                  # Root layout, fonts, no-flash theme script, JSON-LD
│   └── page.tsx                    # Assembled single-page systems architecture narrative
├── components/
│   ├── assistant/                  # "Ask Saurabh" slide-over drawer & context provider
│   ├── navigation/                 # SiteHeader, ScrollHUD, CommandPalette (⌘K), ISTClock
│   ├── primitives/                 # Container, Section, Reveal, Button, Tag, ThemeToggle
│   ├── sections/                   # Hero, SignalStrip, About, Capabilities, StackMap, SelectedWork, Experience, AIWorkflow, Process, Voices, Notes, Contact, Footer
│   └── work/                       # ArchitectureDiagram, OwnerTodoCallout
├── content/                        # Single source of truth (typed TypeScript data)
│   ├── profile.ts                  # Bio, positioning, contact links
│   ├── metrics.ts                  # Verified empirical impact metrics
│   ├── experience.ts               # Career timeline & git-branch data
│   ├── projects.ts                 # Flagship & secondary builds
│   ├── case-studies.ts             # Deep-dive case studies with ADRs and SVG topology
│   ├── stack.ts                    # 5-tier layered technology map
│   ├── capabilities.ts             # 4 architectural competency pillars
│   ├── principles.ts               # Engineering operating principles
│   ├── process.ts                  # 4-stage engineering delivery lifecycle
│   ├── notes.ts                    # Architecture decision records & engineering memos
│   ├── testimonials.ts             # Verified endorsements (empty list: 0 fake quotes)
│   └── assistant-knowledge.ts      # Grounded corpus for the AI assistant
└── __tests__/                      # Automated unit, contract, and invariant test suites
```

---

## 🛠️ Development & Quality Commands

```bash
# Install dependencies
npm install

# Run TypeScript static typecheck (0 errors)
npx tsc --noEmit

# Run all 8 automated test suites
npm test

# Run ESLint validation
npm run lint

# Build production bundle (SSG routes + API endpoints)
npm run build

# Start local development server (with Turbopack)
npm run dev
```

---

## ✍️ How to Add a Project or Case Study

1. **Add metadata to `content/projects.ts`**:
   Add a new entry with title, pitch, problem, solution, role, stack, and destination-strict links.
2. **Add case study breakdown to `content/case-studies.ts`**:
   Define the architectural requirements, interactive SVG topology nodes and edges, key decisions (ADR tradeoffs), and verified metrics.
3. Next.js App Router will automatically pre-render the new static route at `/work/[slug]` during `npm run build` and register it in `sitemap.xml`.

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` to configure optional production integrations:

```bash
NEXT_PUBLIC_SITE_URL=https://www.saurabhdixit93.site
CONTACT_TO_EMAIL=smartds2550@gmail.com
RESEND_API_KEY=               # Optional: for live contact form email delivery
ANTHROPIC_API_KEY=            # Optional: for external LLM assistant provider
```

---

## 📄 License & Ownership

Copyright © 2022–present Saurabh Dixit. All rights reserved.


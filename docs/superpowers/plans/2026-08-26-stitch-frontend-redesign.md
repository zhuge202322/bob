# Stitch Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved Stitch UI across every public Hocore route without changing backend or admin behavior.

**Architecture:** Keep Prisma queries and route ownership in the current App Router pages. Replace the public presentation with a shared Stitch shell, reusable footer and design tokens, then compose route-specific layouts from existing localized content and database records.

**Tech Stack:** Next.js 15, React 19, TypeScript, Prisma, SQLite, CSS, lucide-react, Vitest, Playwright/Browser.

---

### Task 1: Lock the Public Design Contract

**Files:**
- Create: `tests/stitch-ui.test.ts`
- Create: `lib/stitch-ui.ts`

- [ ] Write a failing test for the Clinical Precision tokens, supported navigation, localized labels, and claim-safety rule.
- [ ] Run `pnpm test tests/stitch-ui.test.ts` and confirm the missing module failure.
- [ ] Implement the typed design constants and localized shared copy.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Build the Shared Site Shell

**Files:**
- Modify: `components/SiteHeader.tsx`
- Create: `components/SiteFooter.tsx`
- Modify: `app/globals.css`

- [ ] Implement the Stitch header, active navigation, language menu, mobile drawer, WhatsApp/VK actions, and RFQ CTA.
- [ ] Add the compact, evidence-led Stitch footer and mobile contact rail.
- [ ] Add Clinical Precision tokens and responsive shared component styles without changing admin selectors.

### Task 3: Rebuild the Homepage

**Files:**
- Modify: `components/LocalizedHome.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] Preserve database hero carousel data and implement the Stitch full-width first viewport.
- [ ] Add distinct catalogue, distribution network, professional expertise, application, technical capability, and featured inventory bands using existing data.
- [ ] Keep all navigation, locale, product, PDF, contact, and RFQ links functional.

### Task 4: Rebuild Catalogue and Detail Surfaces

**Files:**
- Modify: `app/[locale]/products/page.tsx`
- Modify: `app/[locale]/products/[slug]/page.tsx`
- Modify: `app/[locale]/product/[slug]/page.tsx`
- Modify: `app/globals.css`

- [ ] Implement the Stitch catalogue sidebar and high-density card system.
- [ ] Keep category and product data server-rendered and ensure every product image uses a stable contain frame.
- [ ] Restyle detail pages around specifications, applications, sourcing metadata, and RFQ actions.

### Task 5: Rebuild Content Pages

**Files:**
- Modify: `components/ContentPage.tsx`
- Modify: `lib/page-content.ts`
- Modify: `app/globals.css`

- [ ] Give solutions, quality, resources, about, and contact distinct Stitch-derived layouts.
- [ ] Retain PDF-derived content and remove any unsupported generated claims.
- [ ] Preserve article, manual download, contact database, and RFQ links.

### Task 6: Rebuild the RFQ Surface

**Files:**
- Modify: `app/[locale]/rfq/page.tsx`
- Modify: `components/RfqForm.tsx`
- Modify: `app/globals.css`

- [ ] Recompose the existing fields into the Stitch inquiry layout.
- [ ] Preserve validation, attachments, prefilled category/CAT No., API submission, loading, error, and success states.

### Task 7: Verify and Repair Fidelity

**Files:**
- Modify: affected public frontend files when mismatches are found

- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
- [ ] Start production on port 3000 and inspect desktop and mobile routes in the Browser.
- [ ] Exercise language switching, product navigation, PDFs, and the RFQ interaction path.
- [ ] Compare implementation screenshots to Stitch references with `view_image`, record mismatches, and repair visible drift.

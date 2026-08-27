# Stitch Frontend Redesign

## Objective

Replace the public website UI with the approved Stitch project "Global Bio-Research Solutions" while preserving the existing Next.js routes, Prisma/SQLite content, admin CRUD, multilingual behavior, RFQ submission, PDF manuals, and WhatsApp/VK channels.

## Design Source

- Stitch project: `projects/1825757554971750883`
- Design system: `Clinical Precision`
- Primary screens: Enhanced Home, Products, Procurement Services, Quality & Compliance, About Us, and Inquiry
- Local reference exports: `tmp/stitch/`

## Visual System

- Research green: `#006b47` and `#00875a`
- Background: `#f7faf8`; white primary surfaces; cool gray sectional bands
- Typography: Inter with 48/56 desktop display, 32/40 mobile display, and 16/24 body text
- Layout: 1280px maximum content width, 24px gutters, 48px desktop margins, and 16px mobile margins
- Geometry: 4px controls, up to 8px large containers, one-pixel low-contrast borders, and minimal shadows
- Imagery: high-resolution laboratory and product imagery, with product photos shown fully using `object-fit: contain`

## Route Mapping

- `/[locale]`: Stitch Enhanced Home with the existing full-width database hero carousel, product categories, global supply network, technical capabilities, featured inventory, and sourcing CTA.
- `/[locale]/products`: Stitch catalogue shell with category navigation, searchable/filterable visual hierarchy, database categories, and representative products.
- `/[locale]/products/[slug]` and `/[locale]/product/[slug]`: matching catalogue detail surfaces with full product imagery, specifications, application, temperature lane, documents, and RFQ actions.
- `/[locale]/solutions`: Stitch Procurement Services layout using PDF-derived sourcing, consolidation, cooperation, delivery, and logistics content.
- `/[locale]/quality`: Stitch Quality layout using only supported source, document, storage, packing, temperature, and handover controls.
- `/[locale]/resources`: dedicated manual library and procurement guidance index in the Stitch system.
- `/[locale]/about`: Stitch About layout using the real Hocore identity, business model, supply network, and company capability.
- `/[locale]/contact`: channel-first contact page with database contacts, WhatsApp, VK, and structured RFQ entry.
- `/[locale]/rfq`: Stitch Inquiry layout wrapped around the existing validated submission flow and attachment support.

## Content Integrity

Stitch is authoritative for visual structure, not business claims. Unsupported certifications, stock levels, response promises, customer logos, laboratory ownership, and metrics shown in generated Stitch samples are excluded. Public content continues to come from the two source manuals, SQLite, and existing verified copy.

## Responsive Behavior

Desktop uses the 12-column visual rhythm and fixed side catalogue navigation. Tablet collapses multi-column sections progressively. Mobile uses a compact header/drawer, one-column content, stable media aspect ratios, fully visible product images, and a persistent WhatsApp/VK/RFQ contact bar without horizontal overflow.

## Verification

Verify English, Chinese, and Russian routes at desktop and mobile sizes; catalogue navigation; product/category details; PDF downloads; language switching; WhatsApp/VK destinations; RFQ success and error states; image framing; browser console health; lint; typecheck; unit tests; and production build.

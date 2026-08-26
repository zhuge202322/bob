# Hocore Biotech B2B Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved English-first, Chinese/Russian multilingual Hocore Biotech B2B website with a custom admin, SQLite content store, product catalogue, resources, compliance content, WhatsApp/VK conversion paths, and private RFQ workflow.

**Architecture:** Use one Next.js App Router application for public pages, `/admin`, and server APIs. Prisma owns the SQLite schema and migrations; published public content is read through locale-aware repositories, while authenticated admin mutations write drafts, audit changes, and trigger cache invalidation. Production runs as one container with a persistent SQLite volume and private upload storage.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Prisma, SQLite WAL, Zod, bcryptjs, Sharp, Nodemailer, Lucide React, Vitest, Testing Library, Playwright, Docker.

---

## Milestones

1. Foundation: application, database, seed data, authentication, audit, media.
2. Content platform: custom admin CRUD, translations, draft/preview/publish.
3. Public website: multilingual layouts, homepage, catalogues, resources, SEO.
4. RFQ operations: form, private attachments, notifications, admin workflow.
5. Launch: content import, accessibility/performance QA, Docker, backup/restore.

Each milestone ends in working, testable software and a focused Git commit.

## File Map

```text
app/
  [locale]/                 Public localized routes
  admin/                    Authenticated custom admin
  api/                      Upload, RFQ, preview and private download APIs
  globals.css               Design tokens and global responsive rules
components/
  admin/                    Admin form, table, media and translation controls
  marketing/                Header, footer, hero, CTA and page sections
  products/                 Catalogue filters, category and product views
  rfq/                      RFQ form and success state
lib/
  auth/                     Password, session, role and CSRF boundaries
  content/                  Locale-aware published content repositories
  db/                       Prisma client and SQLite initialization
  i18n/                     Locales, dictionaries and route helpers
  media/                    Private/public storage and image processing
  rfq/                      Validation, persistence, notification and export
  security/                 Rate limiting, uploads and rich-text sanitization
  seo/                      Metadata, hreflang and structured data
prisma/
  schema.prisma             Complete relational content model
  seed.ts                   Site settings and 16 source-derived categories
public/                     Static icons and generated public media only
scripts/                    Backup, restore and source-content import
tests/                      Unit and integration tests
e2e/                        Playwright user journeys
storage/                    Runtime persistent data; Git ignored
```

Shared contracts used throughout the tasks:

```ts
export type Locale = 'en' | 'zh' | 'ru'
export type Role = 'ADMIN' | 'EDITOR' | 'RFQ_OPERATOR'
export type Permission =
  | 'content:read' | 'content:write' | 'content:publish'
  | 'rfq:read' | 'rfq:write' | 'rfq:export' | 'users:manage'
export type PublishIntent = 'SAVE_DRAFT' | 'PREVIEW' | 'PUBLISH' | 'UNPUBLISH'
export type UserContext = { id: string; email: string; role: Role }
export type TranslationInput = { locale: Locale; slug: string; title: string; description: string }
export type CategoryInput = {
  id?: string; key: string; productLineId: string; imageId?: string; temperature: string;
  sortOrder: number; translations: TranslationInput[]; previousSlugs: Partial<Record<Locale, string>>
}
export type HeroSlideInput = {
  id?: string; desktopImageId: string; mobileImageId?: string; focalX: number; focalY: number;
  sortOrder: number; enabled: boolean; deletedAt?: Date | null; translations: TranslationInput[]
}
export type SectionType =
  | 'HERO' | 'QUICK_LINKS' | 'PRODUCT_MATRIX' | 'BRAND_REGIONS' | 'SOLUTIONS' | 'COMPLIANCE'
  | 'METRICS' | 'RESOURCE_FEED' | 'AUDIENCE_PATHS' | 'CTA' | 'RICH_TEXT' | 'CONTACT'
export type SectionProps = { locale: Locale; section: PublishedSection }
export type RfqRequest = {
  ip: string; idempotencyKey: string; form: unknown;
  files: Array<{ name: string; type: string; bytes: Uint8Array }>
}
```

## Milestone 1: Foundation

### Task 1: Scaffold the application and test harness

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `tests/setup.ts`

- [ ] **Step 1: Scaffold Next.js in the existing repository**

Run:

```powershell
pnpm dlx create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-pnpm
```

Expected: Next.js files are created without modifying `网站资料/` or `docs/`.

- [ ] **Step 2: Install runtime and test dependencies**

Run:

```powershell
pnpm add @prisma/client zod bcryptjs sharp nodemailer lucide-react sanitize-html
pnpm add -D prisma vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom jsdom @playwright/test tsx @types/nodemailer @types/sanitize-html
```

Expected: `pnpm-lock.yaml` records exact versions.

- [ ] **Step 3: Add deterministic scripts and environment contract**

Set `package.json` scripts to:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "content:import": "tsx scripts/import-catalogues.ts"
  }
}
```

Create `.env.example`:

```dotenv
DATABASE_URL="file:./storage/hocore.db"
SESSION_COOKIE_NAME="hocore_session"
SESSION_TTL_HOURS="12"
APP_URL="http://localhost:3000"
UPLOAD_ROOT="./storage/uploads"
RFQ_MAX_FILE_BYTES="10485760"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
RFQ_NOTIFY_TO="zehongyan2025@outlook.com"
```

- [ ] **Step 4: Add a smoke test before changing the starter page**

Create `tests/app/smoke.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import RootLayout from '@/app/layout'

it('renders the application shell', () => {
  render(<RootLayout><main>Hocore</main></RootLayout>)
  expect(screen.getByText('Hocore')).toBeInTheDocument()
})
```

- [ ] **Step 5: Run the foundation checks**

Run:

```powershell
pnpm test
pnpm typecheck
pnpm lint
```

Expected: all commands exit with code 0.

- [ ] **Step 6: Commit the scaffold**

```powershell
git add package.json pnpm-lock.yaml next.config.ts tsconfig.json vitest.config.ts playwright.config.ts .env.example .gitignore app tests
git commit -m "chore: scaffold Hocore website"
```

### Task 2: Define the SQLite content model and source seed

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `lib/db/client.ts`
- Create: `lib/db/constants.ts`
- Create: `tests/db/seed.test.ts`
- Create: `storage/.gitkeep`
- Modify: `.gitignore`

- [ ] **Step 1: Write a failing seed contract test**

Create `tests/db/seed.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { coreCategorySeeds } from '@/prisma/seed-data'

describe('catalogue seed', () => {
  it('contains eight reagent and eight consumable categories', () => {
    expect(coreCategorySeeds.filter((item) => item.line === 'REAGENT')).toHaveLength(8)
    expect(coreCategorySeeds.filter((item) => item.line === 'CONSUMABLE')).toHaveLength(8)
    expect(new Set(coreCategorySeeds.map((item) => item.key)).size).toBe(16)
  })
})
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `pnpm vitest run tests/db/seed.test.ts`

Expected: FAIL because `prisma/seed-data.ts` does not exist.

- [ ] **Step 3: Implement the schema**

Create Prisma models with these exact responsibilities and relations:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String     @id @default(cuid())
  email        String     @unique
  name         String
  passwordHash String
  role         String     @default("EDITOR")
  active       Boolean    @default(true)
  sessions     Session[]
  audits       AuditLog[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

model Session {
  id        String   @id @default(cuid())
  tokenHash String   @unique
  userId    String
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@index([userId, expiresAt])
}

model SiteSetting {
  id              String  @id @default("site")
  siteName         String  @default("Hocore Biotech")
  defaultLocale    String  @default("en")
  enabledLocales   String  @default("en,zh,ru")
  logoId           String?
  faviconId        String?
  defaultOgImageId String?
  footerLegalEn    String  @default("")
  footerLegalZh    String  @default("")
  footerLegalRu    String  @default("")
  updatedAt        DateTime @updatedAt
}

model MediaAsset {
  id           String   @id @default(cuid())
  storageKey   String   @unique
  originalName String
  mimeType     String
  byteSize     Int
  width        Int?
  height       Int?
  sha256       String
  altEn        String   @default("")
  altZh        String   @default("")
  altRu        String   @default("")
  visibility   String   @default("PUBLIC")
  deletedAt    DateTime?
  createdAt    DateTime @default(now())
}

model Contact {
  id        String   @id @default(cuid())
  type      String
  label     String
  value     String
  href      String
  sortOrder Int      @default(0)
  enabled   Boolean  @default(true)
  deletedAt DateTime?
}

model SocialLink {
  id        String   @id @default(cuid())
  platform  String
  url       String
  sortOrder Int      @default(0)
  enabled   Boolean  @default(true)
  deletedAt DateTime?
}

model ProductLine {
  id           String                   @id @default(cuid())
  key          String                   @unique
  sortOrder    Int                      @default(0)
  translations ProductLineTranslation[]
  categories   ProductCategory[]
}

model ProductLineTranslation {
  id            String      @id @default(cuid())
  productLineId String
  locale        String
  name          String
  slug          String
  description   String
  productLine   ProductLine @relation(fields: [productLineId], references: [id], onDelete: Cascade)
  @@unique([productLineId, locale])
  @@unique([locale, slug])
}

model ProductCategory {
  id           String                       @id @default(cuid())
  key          String                       @unique
  productLineId String
  imageId      String?
  temperature String                       @default("AMBIENT")
  sortOrder    Int                          @default(0)
  status       String                       @default("DRAFT")
  publishedAt  DateTime?
  deletedAt    DateTime?
  productLine  ProductLine                  @relation(fields: [productLineId], references: [id])
  translations ProductCategoryTranslation[]
  products     Product[]
  brands       CategoryBrand[]
}

model ProductCategoryTranslation {
  id          String          @id @default(cuid())
  categoryId  String
  locale      String
  name        String
  slug        String
  description String
  scope       String
  specifications String
  seoTitle    String          @default("")
  seoDescription String       @default("")
  category    ProductCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  @@unique([categoryId, locale])
  @@unique([locale, slug])
}

model Brand {
  id        String          @id @default(cuid())
  name      String          @unique
  region    String
  website   String?
  enabled   Boolean         @default(true)
  categories CategoryBrand[]
  products  Product[]
}

model CategoryBrand {
  categoryId String
  brandId    String
  category   ProductCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  brand      Brand           @relation(fields: [brandId], references: [id], onDelete: Cascade)
  @@id([categoryId, brandId])
}

model Product {
  id           String               @id @default(cuid())
  categoryId   String
  brandId      String?
  catNo        String?
  temperature  String               @default("AMBIENT")
  imageId      String?
  status       String               @default("DRAFT")
  sortOrder    Int                  @default(0)
  publishedAt  DateTime?
  deletedAt    DateTime?
  category     ProductCategory      @relation(fields: [categoryId], references: [id])
  brand        Brand?               @relation(fields: [brandId], references: [id])
  translations ProductTranslation[]
}

model ProductTranslation {
  id          String  @id @default(cuid())
  productId   String
  locale      String
  name        String
  slug        String
  description String
  specification String
  application String
  seoTitle    String @default("")
  seoDescription String @default("")
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  @@unique([productId, locale])
  @@unique([locale, slug])
}
```

Complete the schema with these models:

```prisma
model Page {
  id           String            @id @default(cuid())
  key          String            @unique
  status       String            @default("DRAFT")
  publishedAt  DateTime?
  deletedAt    DateTime?
  translations PageTranslation[]
  sections     PageSection[]
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
}

model PageTranslation {
  id             String @id @default(cuid())
  pageId         String
  locale         String
  title          String
  slug           String
  seoTitle       String @default("")
  seoDescription String @default("")
  page            Page   @relation(fields: [pageId], references: [id], onDelete: Cascade)
  @@unique([pageId, locale])
  @@unique([locale, slug])
}

model PageSection {
  id           String                   @id @default(cuid())
  pageId       String
  type         String
  configJson   String                   @default("{}")
  imageId      String?
  sortOrder    Int                      @default(0)
  enabled      Boolean                  @default(true)
  status       String                   @default("DRAFT")
  publishedAt  DateTime?
  deletedAt    DateTime?
  page         Page                     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  translations PageSectionTranslation[]
  @@index([pageId, sortOrder])
}

model PageSectionTranslation {
  id        String      @id @default(cuid())
  sectionId String
  locale    String
  eyebrow   String      @default("")
  title     String
  body      String      @default("")
  ctaLabel  String      @default("")
  ctaHref   String      @default("")
  section   PageSection @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  @@unique([sectionId, locale])
}

model HeroSlide {
  id             String                 @id @default(cuid())
  desktopImageId String
  mobileImageId  String?
  focalX         Float                  @default(0.5)
  focalY         Float                  @default(0.5)
  sortOrder      Int                    @default(0)
  enabled        Boolean                @default(true)
  status         String                 @default("DRAFT")
  publishedAt    DateTime?
  deletedAt      DateTime?
  translations   HeroSlideTranslation[]
  @@index([status, enabled, sortOrder])
}

model HeroSlideTranslation {
  id          String    @id @default(cuid())
  heroSlideId String
  locale      String
  eyebrow     String    @default("")
  title       String
  body        String
  primaryLabel String
  primaryHref  String
  secondaryLabel String @default("")
  secondaryHref  String @default("")
  heroSlide   HeroSlide @relation(fields: [heroSlideId], references: [id], onDelete: Cascade)
  @@unique([heroSlideId, locale])
}

model Article {
  id               String               @id @default(cuid())
  topic            String
  coverImageId     String?
  authorDepartment String               @default("Hocore Technical & Supply Team")
  reviewer         String?
  status           String               @default("DRAFT")
  publishedAt      DateTime?
  deletedAt        DateTime?
  translations     ArticleTranslation[]
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt
}

model ArticleTranslation {
  id             String  @id @default(cuid())
  articleId      String
  locale         String
  title          String
  slug           String
  summary        String
  bodyHtml       String
  seoTitle       String  @default("")
  seoDescription String  @default("")
  article        Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  @@unique([articleId, locale])
  @@unique([locale, slug])
}

model Faq {
  id           String           @id @default(cuid())
  topic        String
  sortOrder    Int              @default(0)
  enabled      Boolean          @default(true)
  deletedAt    DateTime?
  translations FaqTranslation[]
}

model FaqTranslation {
  id       String @id @default(cuid())
  faqId    String
  locale   String
  question String
  answer   String
  faq      Faq    @relation(fields: [faqId], references: [id], onDelete: Cascade)
  @@unique([faqId, locale])
}

model Rfq {
  id                  String          @id @default(cuid())
  reference           String          @unique
  idempotencyKey      String          @unique
  customerType        String
  company             String
  contactName         String
  email               String
  messenger           String?
  country             String
  city                String
  brand               String?
  catNo               String?
  productDescription  String
  quantity            String
  temperature         String
  desiredDeliveryDate DateTime?
  notes               String?
  locale              String
  sourcePath          String
  consentAt           DateTime
  status              String          @default("NEW")
  notificationStatus  String          @default("PENDING")
  archivedAt          DateTime?
  attachments         RfqAttachment[]
  internalNotes       RfqNote[]
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt
  @@index([status, createdAt])
  @@index([email, createdAt])
}

model RfqAttachment {
  id           String   @id @default(cuid())
  rfqId        String
  storageKey   String   @unique
  originalName String
  mimeType     String
  byteSize     Int
  sha256       String
  rfq          Rfq      @relation(fields: [rfqId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  @@index([rfqId])
}

model RfqNote {
  id        String   @id @default(cuid())
  rfqId     String
  authorId  String
  body      String
  rfq       Rfq      @relation(fields: [rfqId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@index([rfqId, createdAt])
}

model AuditLog {
  id            String   @id @default(cuid())
  userId        String
  action        String
  entity        String
  entityId      String
  changeSummary String
  ipAddress     String
  user          User     @relation(fields: [userId], references: [id])
  createdAt     DateTime @default(now())
  @@index([entity, entityId, createdAt])
  @@index([userId, createdAt])
}

model Redirect {
  id        String   @id @default(cuid())
  locale    String
  fromPath  String
  toPath    String
  permanent Boolean  @default(true)
  createdAt DateTime @default(now())
  @@unique([locale, fromPath])
}
```

- [ ] **Step 4: Add exact seed data for two lines and 16 category keys**

Create `prisma/seed-data.ts` exporting `coreCategorySeeds` with these keys:

```ts
export const coreCategorySeeds = [
  { key: 'molecular-biology-reagents', line: 'REAGENT' },
  { key: 'cell-biology-reagents', line: 'REAGENT' },
  { key: 'protein-biochemistry-reagents', line: 'REAGENT' },
  { key: 'immunology-reagents', line: 'REAGENT' },
  { key: 'microbiology-reagents', line: 'REAGENT' },
  { key: 'nucleic-protein-purification-reagents', line: 'REAGENT' },
  { key: 'staining-detection-reagents', line: 'REAGENT' },
  { key: 'buffers-solutions', line: 'REAGENT' },
  { key: 'general-lab-consumables', line: 'CONSUMABLE' },
  { key: 'cell-biology-consumables', line: 'CONSUMABLE' },
  { key: 'molecular-biology-consumables', line: 'CONSUMABLE' },
  { key: 'protein-biochemistry-consumables', line: 'CONSUMABLE' },
  { key: 'microbiology-histopathology-consumables', line: 'CONSUMABLE' },
  { key: 'filtration-chromatography-consumables', line: 'CONSUMABLE' },
  { key: 'sample-storage-consumables', line: 'CONSUMABLE' },
  { key: 'safety-animal-research-consumables', line: 'CONSUMABLE' }
] as const
```

- [ ] **Step 5: Generate and migrate the database**

Run:

```powershell
pnpm prisma format
pnpm prisma migrate dev --name initial_content_model
pnpm db:seed
pnpm vitest run tests/db/seed.test.ts
```

Expected: migration succeeds and the seed test passes.

- [ ] **Step 6: Commit the data foundation**

```powershell
git add prisma lib/db tests/db storage/.gitkeep .gitignore
git commit -m "feat: add multilingual SQLite content model"
```

### Task 3: Implement authentication, authorization, CSRF, and audit logging

**Files:**
- Create: `lib/auth/password.ts`
- Create: `lib/auth/session.ts`
- Create: `lib/auth/permissions.ts`
- Create: `lib/security/csrf.ts`
- Create: `lib/audit/write-audit.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/actions.ts`
- Create: `app/admin/layout.tsx`
- Create: `tests/auth/session.test.ts`
- Create: `tests/auth/permissions.test.ts`

- [ ] **Step 1: Write failing permission and expiry tests**

```ts
import { expect, it } from 'vitest'
import { can, isSessionAlive } from '@/lib/auth/permissions'

it('prevents an RFQ operator from publishing content', () => {
  expect(can('RFQ_OPERATOR', 'content:publish')).toBe(false)
  expect(can('ADMIN', 'content:publish')).toBe(true)
})

it('rejects an expired session', () => {
  expect(isSessionAlive(new Date('2026-08-25T00:00:00Z'), new Date('2026-08-26T00:00:00Z'))).toBe(false)
})
```

- [ ] **Step 2: Run tests and verify missing implementation failures**

Run: `pnpm vitest run tests/auth`

Expected: FAIL with unresolved auth modules.

- [ ] **Step 3: Implement the role matrix**

```ts
export const permissions = {
  ADMIN: ['content:read', 'content:write', 'content:publish', 'rfq:read', 'rfq:write', 'rfq:export', 'users:manage'],
  EDITOR: ['content:read', 'content:write'],
  RFQ_OPERATOR: ['content:read', 'rfq:read', 'rfq:write', 'rfq:export']
} as const

export function can(role: keyof typeof permissions, permission: string) {
  return (permissions[role] as readonly string[]).includes(permission)
}

export function isSessionAlive(expiresAt: Date, now = new Date()) {
  return expiresAt.getTime() > now.getTime()
}
```

- [ ] **Step 4: Implement opaque database sessions**

Generate 32 random bytes, store only a SHA-256 token hash in `Session`, set the raw token in an HttpOnly/Secure/SameSite=Lax cookie, rotate it at login, and delete both cookie and row at logout. `requireUser()` must reject inactive users and expired sessions.

```ts
export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 60 * 60 * 1000)
  await prisma.session.create({ data: { userId, tokenHash, expiresAt } })
  const cookieStore = await cookies()
  cookieStore.set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax', path: '/', expires: expiresAt
  })
}
```

- [ ] **Step 5: Protect `/admin` and mutation actions**

The admin layout calls `requireUser()`. Every mutation calls `requirePermission()` and `verifyCsrfToken()`, then writes an `AuditLog` containing actor, action, entity, entity ID, request IP and a redacted change summary.

```ts
export async function authorizeMutation(permission: Permission, formData: FormData) {
  const user = await requireUser()
  requirePermission(user.role, permission)
  await verifyCsrfToken(String(formData.get('csrfToken') ?? ''))
  return user
}
```

- [ ] **Step 6: Verify and commit**

Run:

```powershell
pnpm vitest run tests/auth
pnpm typecheck
pnpm lint
git add lib/auth lib/security lib/audit app/admin tests/auth prisma
git commit -m "feat: secure custom admin sessions and roles"
```

Expected: tests, typecheck and lint pass.

### Task 4: Implement public/private media storage

**Files:**
- Create: `lib/media/storage.ts`
- Create: `lib/media/image.ts`
- Create: `lib/security/file-validation.ts`
- Create: `app/api/admin/media/route.ts`
- Create: `app/api/media/[id]/route.ts`
- Create: `tests/media/file-validation.test.ts`
- Create: `tests/media/storage.test.ts`

- [ ] **Step 1: Write file validation tests**

Test that JPEG/PNG/WebP image signatures are accepted, a renamed executable is rejected, files over the configured limit are rejected, and RFQ document MIME types are separate from public image MIME types.

- [ ] **Step 2: Run tests and verify failure**

Run: `pnpm vitest run tests/media`

Expected: FAIL because validators do not exist.

- [ ] **Step 3: Implement the storage interface**

```ts
export interface StorageDriver {
  put(key: string, bytes: Uint8Array): Promise<void>
  read(key: string): Promise<Uint8Array>
  remove(key: string): Promise<void>
  exists(key: string): Promise<boolean>
}
```

Provide `LocalStorageDriver` rooted at `UPLOAD_ROOT`; resolve every key and assert the final absolute path remains under that root. Store public image derivatives under `public/` and RFQ documents under `private/rfq/`.

- [ ] **Step 4: Process uploaded images**

Use Sharp to read actual dimensions, strip metadata, create WebP widths 640/1280/1920, compute SHA-256, and insert `MediaAsset`. Reject unsupported or malformed images before writing.

```ts
export async function processPublicImage(input: Uint8Array, originalName: string) {
  const validated = await validateImageFile(input, originalName)
  const id = randomUUID()
  const derivatives = await Promise.all([640, 1280, 1920].map(async (width) => ({
    width,
    bytes: await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
  })))
  return persistImageAsset({ id, validated, derivatives })
}
```

- [ ] **Step 5: Enforce reference-aware deletion**

Before soft-deleting a media record, count references from settings, hero slides, sections, categories, products and articles. Return HTTP 409 with the referencing entity names when the count is non-zero.

```ts
export type MediaReference = { entity: 'settings' | 'hero' | 'section' | 'category' | 'product' | 'article'; id: string }

export async function removeMedia(id: string) {
  const references = await findMediaReferences(id)
  if (references.length) throw new MediaInUseError(references)
  return prisma.mediaAsset.update({ where: { id }, data: { deletedAt: new Date() } })
}
```

- [ ] **Step 6: Verify and commit**

```powershell
pnpm vitest run tests/media
pnpm typecheck
git add lib/media lib/security app/api/admin/media app/api/media tests/media
git commit -m "feat: add validated media storage"
```

## Milestone 2: Custom Admin

### Task 5: Build the admin shell and reusable content controls

**Files:**
- Create: `components/admin/admin-shell.tsx`
- Create: `components/admin/data-table.tsx`
- Create: `components/admin/locale-tabs.tsx`
- Create: `components/admin/status-badge.tsx`
- Create: `components/admin/media-picker.tsx`
- Create: `components/admin/delete-dialog.tsx`
- Create: `components/admin/publish-controls.tsx`
- Create: `app/admin/page.tsx`
- Create: `tests/admin/locale-tabs.test.tsx`

- [ ] **Step 1: Test locale completion behavior**

Render EN/ZH/RU tabs and assert English blocks publishing when incomplete, while incomplete Chinese or Russian remains a draft and is marked visibly.

- [ ] **Step 2: Run the component test and verify failure**

Run: `pnpm vitest run tests/admin/locale-tabs.test.tsx`

- [ ] **Step 3: Implement the admin shell**

Use a restrained dark-green sidebar with Dashboard, Site Settings, Pages & Sections, Hero Slides, Product Categories, Products, Brands, Contacts & Socials, Resources, Media Library, RFQ Inbox, Users and Audit Log. Use Lucide icons and tooltip labels; support a collapsed mobile drawer.

```tsx
export const adminNav = [
  ['Dashboard', '/admin'], ['Site Settings', '/admin/settings'], ['Pages & Sections', '/admin/pages'],
  ['Hero Slides', '/admin/hero'], ['Product Categories', '/admin/categories'], ['Products', '/admin/products'],
  ['Brands', '/admin/brands'], ['Contacts & Socials', '/admin/contacts'], ['Resources', '/admin/resources'],
  ['Media Library', '/admin/media'], ['RFQ Inbox', '/admin/rfq'], ['Users & Audit Log', '/admin/users']
] as const
```

- [ ] **Step 4: Implement reusable form controls**

`LocaleTabs` exposes `en`, `zh`, `ru`; `PublishControls` submits draft, preview or publish intent; `DeleteDialog` requires the entity name; `MediaPicker` returns a `MediaAsset.id` and displays reference warnings.

```ts
export type LocaleTabState = { locale: Locale; complete: boolean; required: boolean }
export type PublishIntent = 'SAVE_DRAFT' | 'PREVIEW' | 'PUBLISH' | 'UNPUBLISH'
export type MediaPickerValue = { id: string; previewUrl: string; references: MediaReference[] } | null
```

- [ ] **Step 5: Verify and commit**

```powershell
pnpm vitest run tests/admin
pnpm typecheck
pnpm lint
git add components/admin app/admin tests/admin
git commit -m "feat: add custom admin interface shell"
```

### Task 6: Implement settings, contacts, socials, and media CRUD

**Files:**
- Create: `app/admin/settings/page.tsx`
- Create: `app/admin/settings/actions.ts`
- Create: `app/admin/contacts/page.tsx`
- Create: `app/admin/contacts/actions.ts`
- Create: `app/admin/media/page.tsx`
- Create: `lib/validation/settings.ts`
- Create: `lib/validation/contact.ts`
- Create: `tests/admin/settings-actions.test.ts`

- [ ] **Step 1: Write failing action tests**

Test that the site name cannot be blank, the default locale must be enabled, WhatsApp uses an HTTPS `wa.me` link, VK uses an HTTPS `vk.com` link, and a disabled contact does not appear in public queries.

- [ ] **Step 2: Implement Zod schemas**

```ts
export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(2).max(80),
  defaultLocale: z.enum(['en', 'zh', 'ru']),
  enabledLocales: z.array(z.enum(['en', 'zh', 'ru'])).min(1),
  logoId: z.string().cuid().nullable(),
  faviconId: z.string().cuid().nullable()
}).refine((value) => value.enabledLocales.includes(value.defaultLocale), {
  message: 'Default locale must be enabled', path: ['defaultLocale']
})
```

- [ ] **Step 3: Implement CRUD actions and audit writes**

Settings use one upserted `SiteSetting`. Contacts and socials support create, update, reorder, enable/disable and soft delete. Reject deletion of the last enabled primary contact.

```ts
export async function saveSiteSettings(input: unknown, actor: UserContext) {
  const value = siteSettingsSchema.parse(input)
  return auditedTransaction(actor, 'SiteSetting', 'site', () =>
    prisma.siteSetting.upsert({ where: { id: 'site' }, create: { id: 'site', ...value }, update: value })
  )
}
```

- [ ] **Step 4: Verify public cache invalidation**

After successful publish, call `revalidatePath('/[locale]', 'layout')`; drafts do not invalidate public pages.

```ts
export function invalidateGlobalPublicContent(intent: PublishIntent) {
  if (intent === 'PUBLISH' || intent === 'UNPUBLISH') revalidatePath('/[locale]', 'layout')
}
```

- [ ] **Step 5: Verify and commit**

```powershell
pnpm vitest run tests/admin/settings-actions.test.ts
pnpm typecheck
git add app/admin/settings app/admin/contacts app/admin/media lib/validation tests/admin
git commit -m "feat: manage site identity and contact channels"
```

### Task 7: Implement brands, categories, and products CRUD

**Files:**
- Create: `app/admin/brands/page.tsx`
- Create: `app/admin/brands/actions.ts`
- Create: `app/admin/categories/page.tsx`
- Create: `app/admin/categories/[id]/page.tsx`
- Create: `app/admin/categories/actions.ts`
- Create: `app/admin/products/page.tsx`
- Create: `app/admin/products/[id]/page.tsx`
- Create: `app/admin/products/actions.ts`
- Create: `lib/validation/catalogue.ts`
- Create: `tests/admin/catalogue-actions.test.ts`

- [ ] **Step 1: Test catalogue invariants**

Test unique localized slugs, English translation required for publishing, category deletion blocked when active products exist, soft deletion, valid temperature values, and brand-region grouping.

- [ ] **Step 2: Run the tests and verify failure**

Run: `pnpm vitest run tests/admin/catalogue-actions.test.ts`

- [ ] **Step 3: Implement transactional writes**

Create/update each entity and its three translations in one Prisma transaction. Preserve stable IDs across translation edits. On published slug change, insert a `Redirect` from the old localized path to the new localized path.

```ts
export async function saveCategory(input: CategoryInput) {
  return prisma.$transaction(async (tx) => {
    const category = await tx.productCategory.upsert(categoryMutation(input))
    await upsertCategoryTranslations(tx, category.id, input.translations)
    await createSlugRedirects(tx, input.previousSlugs, input.translations)
    return category
  })
}
```

- [ ] **Step 4: Implement list and edit screens**

Category list filters by product line/status; product list filters by category/brand/temperature/status and supports bulk publish/unpublish. Edit screens include locale tabs, media picker, brand associations, sort order and SEO fields.

```ts
export type CatalogueAdminFilters = {
  line?: 'REAGENT' | 'CONSUMABLE'; categoryId?: string; brandId?: string;
  temperature?: 'AMBIENT' | 'COLD_2_8' | 'FROZEN_MINUS_20'; status?: 'DRAFT' | 'PUBLISHED'
}
```

- [ ] **Step 5: Verify and commit**

```powershell
pnpm vitest run tests/admin/catalogue-actions.test.ts
pnpm typecheck
pnpm lint
git add app/admin/brands app/admin/categories app/admin/products lib/validation/catalogue.ts tests/admin
git commit -m "feat: manage multilingual product catalogue"
```

### Task 8: Implement pages, hero slides, resources, FAQ, preview, and publishing

**Files:**
- Create: `app/admin/pages/page.tsx`
- Create: `app/admin/pages/[id]/page.tsx`
- Create: `app/admin/pages/actions.ts`
- Create: `app/admin/hero/page.tsx`
- Create: `app/admin/hero/actions.ts`
- Create: `app/admin/resources/page.tsx`
- Create: `app/admin/resources/[id]/page.tsx`
- Create: `app/admin/resources/actions.ts`
- Create: `app/api/preview/route.ts`
- Create: `lib/content/publish.ts`
- Create: `tests/admin/publishing.test.ts`

- [ ] **Step 1: Test draft visibility and publication**

Create a draft section, assert it is absent from `getPublishedPage()`, publish it, assert it appears in sort order, unpublish it, and assert it disappears without data loss.

- [ ] **Step 2: Implement controlled section types**

Allow only: `HERO`, `QUICK_LINKS`, `PRODUCT_MATRIX`, `BRAND_REGIONS`, `SOLUTIONS`, `COMPLIANCE`, `METRICS`, `RESOURCE_FEED`, `AUDIENCE_PATHS`, `CTA`, `RICH_TEXT`, `CONTACT`. Store type-specific JSON only after validating it with a matching Zod discriminated union.

```ts
export const sectionConfigSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('HERO'), slideIds: z.array(z.string().cuid()).min(1).max(5) }),
  z.object({ type: z.literal('QUICK_LINKS'), itemIds: z.array(z.string()).min(1).max(6) }),
  z.object({ type: z.literal('PRODUCT_MATRIX'), line: z.enum(['ALL', 'REAGENT', 'CONSUMABLE']) }),
  z.object({ type: z.literal('BRAND_REGIONS'), regions: z.array(z.enum(['AMERICAS', 'EUROPE', 'ASIA_PACIFIC', 'CHINA'])) }),
  z.object({ type: z.literal('SOLUTIONS'), pageKeys: z.array(z.string()).max(6) }),
  z.object({ type: z.literal('COMPLIANCE'), pageKeys: z.array(z.string()).max(6) }),
  z.object({ type: z.literal('METRICS'), metricKeys: z.array(z.string()).max(6) }),
  z.object({ type: z.literal('RESOURCE_FEED'), topic: z.string().optional(), limit: z.number().int().min(1).max(12) }),
  z.object({ type: z.literal('AUDIENCE_PATHS'), audienceKeys: z.array(z.string()).max(4) }),
  z.object({ type: z.literal('CTA'), theme: z.enum(['GREEN', 'LIGHT', 'GOLD']) }),
  z.object({ type: z.literal('RICH_TEXT'), maxWidth: z.enum(['NARROW', 'CONTENT', 'WIDE']) }),
  z.object({ type: z.literal('CONTACT'), showMap: z.boolean() })
])
```

- [ ] **Step 3: Implement hero management**

Support desktop image, mobile image, x/y focal point, three translations, two CTA links, sort order and enabled state. Require exactly one active first slide before homepage publication; permit 1-5 total active slides.

```ts
export function validateHeroForPublish(slides: HeroSlideInput[]) {
  const active = slides.filter((slide) => slide.enabled && !slide.deletedAt)
  if (active.length < 1 || active.length > 5) throw new Error('Homepage requires 1-5 active slides')
  if (!active.some((slide) => slide.sortOrder === 0)) throw new Error('Homepage requires a first slide')
}
```

- [ ] **Step 4: Implement preview tokens**

Generate a short-lived, signed preview token containing user ID, entity type and ID. The preview route verifies signature and expiry, enables Next.js draft mode, and redirects only to an internal localized path.

```ts
export type PreviewClaims = { sub: string; entity: 'page' | 'article' | 'category' | 'product'; id: string; exp: number }
export function isInternalPreviewPath(path: string) {
  return /^\/(en|zh|ru)(\/|$)/.test(path) && !path.startsWith('//')
}
```

- [ ] **Step 5: Implement article and FAQ CRUD**

Sanitize rich text on write, store author department/reviewer fields, related category IDs and publication timestamps. English is required for publish; other translations can remain drafts and stay out of their locale navigation.

```ts
export const sanitizeOptions = {
  allowedTags: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
  allowedAttributes: { a: ['href', 'target', 'rel'], th: ['scope'] },
  allowedSchemes: ['http', 'https', 'mailto']
}
```

- [ ] **Step 6: Verify and commit**

```powershell
pnpm vitest run tests/admin/publishing.test.ts
pnpm typecheck
pnpm lint
git add app/admin/pages app/admin/hero app/admin/resources app/api/preview lib/content tests/admin
git commit -m "feat: add draft and publish content workflow"
```

## Milestone 3: Public Website

### Task 9: Implement locale routing, shared layout, navigation, and social CTAs

**Files:**
- Create: `lib/i18n/config.ts`
- Create: `lib/i18n/routes.ts`
- Create: `lib/i18n/dictionaries/en.ts`
- Create: `lib/i18n/dictionaries/zh.ts`
- Create: `lib/i18n/dictionaries/ru.ts`
- Create: `middleware.ts`
- Create: `app/[locale]/layout.tsx`
- Create: `components/marketing/site-header.tsx`
- Create: `components/marketing/site-footer.tsx`
- Create: `components/marketing/mobile-contact-bar.tsx`
- Create: `tests/i18n/routes.test.ts`

- [ ] **Step 1: Test route localization**

Test root redirects to `/en`, unsupported locales return not-found, language switching preserves entity identity when a translation exists, and falls back to the target locale homepage with `translation=missing` when it does not.

- [ ] **Step 2: Implement locale helpers**

```ts
export const locales = ['en', 'zh', 'ru'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}
```

- [ ] **Step 3: Build the shared responsive layout**

Header navigation uses Products, Supply Solutions, Quality & Compliance, Resources, About, language menu, WhatsApp and VK. Mobile bottom bar contains WhatsApp, VK and RFQ. Use Lucide icons with accessible labels and no text overlap at 360 px.

```tsx
const primaryNav = [
  { key: 'products', href: '/products' }, { key: 'solutions', href: '/solutions/consolidated-procurement' },
  { key: 'quality', href: '/quality/source-traceability' }, { key: 'resources', href: '/resources' },
  { key: 'about', href: '/about' }
] as const
```

- [ ] **Step 4: Verify and commit**

```powershell
pnpm vitest run tests/i18n/routes.test.ts
pnpm typecheck
pnpm lint
git add lib/i18n middleware.ts app/[locale]/layout.tsx components/marketing tests/i18n
git commit -m "feat: add multilingual public site shell"
```

### Task 10: Build the full-width accessible homepage

**Files:**
- Create: `app/[locale]/page.tsx`
- Create: `components/marketing/hero-carousel.tsx`
- Create: `components/marketing/quick-paths.tsx`
- Create: `components/marketing/product-matrix.tsx`
- Create: `components/marketing/supply-network.tsx`
- Create: `components/marketing/compliance-band.tsx`
- Create: `components/marketing/metrics-band.tsx`
- Create: `components/marketing/resource-feed.tsx`
- Create: `components/marketing/audience-paths.tsx`
- Create: `components/marketing/rfq-cta.tsx`
- Create: `tests/home/hero-carousel.test.tsx`

- [ ] **Step 1: Test carousel accessibility**

Assert the first slide is visible, next/previous buttons work, keyboard arrows work, pause toggles rotation, reduced-motion disables auto-advance, and slide changes do not move the text/CTA container.

- [ ] **Step 2: Implement the carousel**

Render 1-5 published slides. Use a stable `min-height`, full viewport width, `next/image` with the first image `priority`, lazy-load later slides, honor focal points with `object-position`, and place headline/CTA in a fixed responsive safe area.

```tsx
<section className="relative min-h-[560px] w-full overflow-hidden md:min-h-[680px]" aria-roledescription="carousel">
  <Image fill priority={index === 0} sizes="100vw" className="object-cover"
    style={{ objectPosition: `${slide.focalX * 100}% ${slide.focalY * 100}%` }} alt={slide.alt} src={slide.src} />
  <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl items-center px-5 md:px-8">{content}</div>
</section>
```

- [ ] **Step 3: Implement the approved section order**

Render Hero, three quick paths, 16-category matrix, supply regions, four solutions, four compliance proofs, delivery metrics, resources, terminal/distributor paths and final RFQ CTA. Every section reads published admin content and has a deterministic empty state.

```ts
export const homepageSectionOrder = [
  'HERO', 'QUICK_LINKS', 'PRODUCT_MATRIX', 'BRAND_REGIONS', 'SOLUTIONS',
  'COMPLIANCE', 'METRICS', 'RESOURCE_FEED', 'AUDIENCE_PATHS', 'CTA'
] as const
```

- [ ] **Step 4: Verify and commit**

```powershell
pnpm vitest run tests/home
pnpm typecheck
pnpm lint
git add app/[locale]/page.tsx components/marketing tests/home
git commit -m "feat: build authoritative multilingual homepage"
```

### Task 11: Build product catalogue, category, product, and brand pages

**Files:**
- Create: `app/[locale]/products/page.tsx`
- Create: `app/[locale]/products/[line]/page.tsx`
- Create: `app/[locale]/products/[line]/[category]/page.tsx`
- Create: `app/[locale]/products/item/[slug]/page.tsx`
- Create: `app/[locale]/brands/page.tsx`
- Create: `components/products/catalogue-filters.tsx`
- Create: `components/products/category-card.tsx`
- Create: `components/products/product-row.tsx`
- Create: `lib/content/catalogue.ts`
- Create: `tests/products/catalogue.test.ts`

- [ ] **Step 1: Test published catalogue queries**

Verify draft/deleted records are excluded; keyword, line, brand region and temperature filters combine with AND semantics; categories sort by `sortOrder`; missing locale translations do not leak English copy.

- [ ] **Step 2: Implement server-side filters**

Parse query parameters with Zod, produce canonical ordered URLs, cap results per page, and mark filtered result pages `noindex,follow`.

```ts
export const catalogueFilterSchema = z.object({
  q: z.string().trim().max(120).optional(),
  line: z.enum(['reagents', 'consumables']).optional(),
  region: z.enum(['americas', 'europe', 'asia-pacific', 'china']).optional(),
  temperature: z.enum(['ambient', '2-8', '-20']).optional(),
  page: z.coerce.number().int().min(1).default(1)
})
```

- [ ] **Step 3: Implement category and product pages**

Category pages show scope, specifications, brands by region, temperature, document availability, related products/resources and prefilled RFQ CTA. Product pages show only configured non-price fields.

```ts
export type PublicCategoryView = {
  name: string; description: string; scope: string; specifications: string;
  temperature: string; brandsByRegion: Record<string, string[]>;
  relatedProducts: PublicProductSummary[]; relatedArticles: PublicArticleSummary[]; rfqHref: string
}
```

- [ ] **Step 4: Verify and commit**

```powershell
pnpm vitest run tests/products
pnpm typecheck
pnpm lint
git add app/[locale]/products app/[locale]/brands components/products lib/content/catalogue.ts tests/products
git commit -m "feat: add searchable product capability catalogue"
```

### Task 12: Build solutions, quality, resources, company, and legal pages

**Files:**
- Create: `app/[locale]/solutions/[slug]/page.tsx`
- Create: `app/[locale]/quality/[slug]/page.tsx`
- Create: `app/[locale]/resources/page.tsx`
- Create: `app/[locale]/resources/[slug]/page.tsx`
- Create: `app/[locale]/faq/page.tsx`
- Create: `app/[locale]/about/page.tsx`
- Create: `app/[locale]/contact/page.tsx`
- Create: `app/[locale]/privacy/page.tsx`
- Create: `app/[locale]/terms/page.tsx`
- Create: `components/marketing/process-timeline.tsx`
- Create: `components/marketing/document-glossary.tsx`
- Create: `tests/content/publication.test.ts`

- [ ] **Step 1: Test publication and locale boundaries**

Test that only published pages/articles/FAQ render, articles show updated/reviewer information when present, and the research-use/legal statements appear on reagent and quality pages.

- [ ] **Step 2: Build reusable page-section rendering**

Map each controlled section type to one focused component. Unknown section types fail closed in production and log an error; they never render raw JSON or arbitrary HTML.

```tsx
export const sectionRenderers: Record<SectionType, React.ComponentType<SectionProps>> = {
  HERO: HeroCarousel, QUICK_LINKS: QuickPaths, PRODUCT_MATRIX: ProductMatrix, BRAND_REGIONS: SupplyNetwork,
  SOLUTIONS: SolutionsBand, COMPLIANCE: ComplianceBand, METRICS: MetricsBand, RESOURCE_FEED: ResourceFeed,
  AUDIENCE_PATHS: AudiencePaths, CTA: RfqCta, RICH_TEXT: RichTextSection, CONTACT: ContactSection
}
```

- [ ] **Step 3: Build resource authority signals**

Article pages render publication date, last update, real reviewer/department, related catalogue links, related downloads and a prefilled RFQ CTA. FAQ uses accessible disclosure controls.

```tsx
<details className="border-b border-emerald-900/15 py-4">
  <summary className="cursor-pointer font-semibold">{faq.question}</summary>
  <div className="prose mt-3 max-w-none">{faq.answer}</div>
</details>
```

- [ ] **Step 4: Verify and commit**

```powershell
pnpm vitest run tests/content
pnpm typecheck
pnpm lint
git add app/[locale]/solutions app/[locale]/quality app/[locale]/resources app/[locale]/faq app/[locale]/about app/[locale]/contact app/[locale]/privacy app/[locale]/terms components/marketing tests/content
git commit -m "feat: add supply compliance and resource pages"
```

## Milestone 4: RFQ Operations

### Task 13: Implement RFQ validation, idempotency, private files, and notification

**Files:**
- Create: `lib/rfq/schema.ts`
- Create: `lib/rfq/create-rfq.ts`
- Create: `lib/rfq/reference.ts`
- Create: `lib/rfq/notify.ts`
- Create: `app/[locale]/rfq/page.tsx`
- Create: `components/rfq/rfq-form.tsx`
- Create: `app/api/rfq/route.ts`
- Create: `app/api/admin/rfq/[id]/attachment/[attachmentId]/route.ts`
- Create: `tests/rfq/create-rfq.test.ts`
- Create: `tests/rfq/attachment-access.test.ts`

- [ ] **Step 1: Write failing RFQ tests**

Test required company/contact/product information, consent required, 10 MB default maximum, allowed PDF/XLSX/XLS/CSV/DOCX signatures, duplicate idempotency keys returning the same reference, notification failure preserving the RFQ, and unauthenticated attachment download returning 401.

- [ ] **Step 2: Implement the validation schema**

```ts
export const rfqSchema = z.object({
  customerType: z.enum(['END_USER', 'DISTRIBUTOR', 'OTHER']),
  company: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(120),
  email: z.string().email(),
  messenger: z.string().trim().max(160).optional(),
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(120),
  brand: z.string().trim().max(120).optional(),
  catNo: z.string().trim().max(120).optional(),
  productDescription: z.string().trim().min(3).max(4000),
  quantity: z.string().trim().min(1).max(120),
  temperature: z.enum(['AMBIENT', 'COLD_2_8', 'FROZEN_MINUS_20', 'UNKNOWN']),
  desiredDeliveryDate: z.string().date().optional(),
  notes: z.string().trim().max(4000).optional(),
  locale: z.enum(['en', 'zh', 'ru']),
  sourcePath: z.string().startsWith('/').max(500),
  consent: z.literal(true)
})
```

- [ ] **Step 3: Implement atomic persistence**

Rate-limit by IP and email, validate CSRF and honeypot, write the RFQ and attachments in a transaction, use `RFQ-YYYYMMDD-XXXX` references, and store attachment bytes privately only after validation. If database write fails, remove newly written files.

```ts
export async function createRfq(request: RfqRequest): Promise<{ reference: string }> {
  await enforceRfqRateLimit(request.ip, request.form.email)
  const value = rfqSchema.parse(request.form)
  const existing = await prisma.rfq.findUnique({ where: { idempotencyKey: request.idempotencyKey } })
  if (existing) return { reference: existing.reference }
  const staged = await stagePrivateAttachments(request.files)
  try {
    return await persistRfqWithAttachments(value, request.idempotencyKey, staged)
  } catch (error) {
    await removeStagedFiles(staged)
    throw error
  }
}
```

- [ ] **Step 4: Implement resilient notification**

Send a concise email after commit. Store `notificationStatus` as `SENT` or `FAILED`; notification failure returns a successful RFQ response with its reference and logs a retryable error.

```ts
const rfq = await createRfq(request)
try {
  await notifyBusinessTeam(rfq.reference)
  await setNotificationStatus(rfq.reference, 'SENT')
} catch (error) {
  await setNotificationStatus(rfq.reference, 'FAILED')
  logger.error({ error, reference: rfq.reference }, 'RFQ notification failed')
}
return rfq
```

- [ ] **Step 5: Verify and commit**

```powershell
pnpm vitest run tests/rfq
pnpm typecheck
git add lib/rfq app/[locale]/rfq components/rfq app/api/rfq app/api/admin/rfq tests/rfq
git commit -m "feat: add secure RFQ intake workflow"
```

### Task 14: Build RFQ inbox, notes, status workflow, and CSV export

**Files:**
- Create: `app/admin/rfq/page.tsx`
- Create: `app/admin/rfq/[id]/page.tsx`
- Create: `app/admin/rfq/actions.ts`
- Create: `app/api/admin/rfq/export/route.ts`
- Create: `lib/rfq/export.ts`
- Create: `tests/admin/rfq-workflow.test.ts`

- [ ] **Step 1: Test allowed status transitions and export permissions**

Allow `NEW -> IN_REVIEW -> QUOTED -> WON/LOST`; allow any non-spam state to `SPAM`; allow ADMIN to correct a state. Reject EDITOR access and require `rfq:export` for CSV.

- [ ] **Step 2: Implement inbox and detail pages**

Filter by state/date/customer type/search; show customer data only to authorized roles; display private attachments through authenticated routes; support internal notes and audit every status change/download/export.

```ts
export const rfqTransitions = {
  NEW: ['IN_REVIEW', 'SPAM'], IN_REVIEW: ['QUOTED', 'SPAM'], QUOTED: ['WON', 'LOST', 'SPAM'],
  WON: ['SPAM'], LOST: ['SPAM'], SPAM: []
} as const
```

- [ ] **Step 3: Implement safe CSV export**

Prefix values beginning with `=`, `+`, `-`, or `@` with an apostrophe to prevent spreadsheet formula injection. Export UTF-8 with BOM and only the current filtered result set.

```ts
export function escapeCsvCell(value: unknown) {
  const raw = String(value ?? '')
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw
  return `"${safe.replaceAll('"', '""')}"`
}
```

- [ ] **Step 4: Verify and commit**

```powershell
pnpm vitest run tests/admin/rfq-workflow.test.ts
pnpm typecheck
git add app/admin/rfq app/api/admin/rfq/export lib/rfq/export.ts tests/admin
git commit -m "feat: add RFQ operations inbox"
```

## Milestone 5: SEO, Content, and Launch

### Task 15: Implement SEO, hreflang, redirects, sitemap, and structured data

**Files:**
- Create: `lib/seo/metadata.ts`
- Create: `lib/seo/structured-data.ts`
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `middleware/redirects.ts`
- Create: `tests/seo/metadata.test.ts`

- [ ] **Step 1: Test canonical and hreflang output**

Assert each translated entity emits canonical, `en`, `zh-CN`, `ru-RU`, and `x-default`; unavailable translations are omitted; filtered pages are noindex; no product price schema is emitted.

- [ ] **Step 2: Implement metadata generation**

Use localized title/description/slug/OG image with site defaults as field-level fallbacks. `x-default` points to English. Generate Organization, BreadcrumbList, Article and FAQPage JSON-LD only when required data exists.

```ts
export function alternatesFor(entity: LocalizedEntity, locale: Locale) {
  const languages = Object.fromEntries(entity.translations.map((item) => [toHreflang(item.locale), absoluteUrl(item.path)]))
  return { canonical: absoluteUrl(entity.pathByLocale[locale]), languages: { ...languages, 'x-default': absoluteUrl(entity.pathByLocale.en) } }
}
```

- [ ] **Step 3: Implement redirect lookup and sitemap**

Resolve stored redirects before localized routing, reject redirect loops during admin writes, and include only published canonical URLs in the sitemap.

```ts
export function assertNoRedirectLoop(entries: Array<{ fromPath: string; toPath: string }>) {
  for (const entry of entries) if (resolveRedirectChain(entry.fromPath, entries).includes(entry.fromPath)) throw new Error('Redirect loop')
}
```

- [ ] **Step 4: Verify and commit**

```powershell
pnpm vitest run tests/seo
pnpm typecheck
git add lib/seo app/sitemap.ts app/robots.ts middleware tests/seo
git commit -m "feat: add multilingual technical SEO"
```

### Task 16: Import approved catalogue content and media

**Files:**
- Create: `scripts/import-catalogues.ts`
- Create: `scripts/catalogue-source.ts`
- Create: `tests/import/catalogue-import.test.ts`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Encode source-derived content as structured records**

Create explicit records for all 16 categories, product scope, major specifications, representative brands by region, delivery standards, legal statements and contact details from the two approved PDFs. Do not scrape text at production runtime.

```ts
export type CatalogueSourceRecord = {
  key: string
  line: 'REAGENT' | 'CONSUMABLE'
  translations: Record<Locale, { name: string; slug: string; description: string; scope: string; specifications: string }>
  brands: Array<{ name: string; region: 'AMERICAS' | 'EUROPE' | 'ASIA_PACIFIC' | 'CHINA' }>
  temperature: 'AMBIENT' | 'COLD_2_8' | 'FROZEN_MINUS_20' | 'MIXED'
}
```

- [ ] **Step 2: Test import idempotency**

Run the importer twice against a temporary SQLite database and assert category, brand, contact and page counts remain unchanged on the second run.

```ts
const first = await importCatalogues(testDb)
const second = await importCatalogues(testDb)
expect(second.counts).toEqual(first.counts)
expect(second.created).toBe(0)
```

- [ ] **Step 3: Import source images and Logo safely**

Process the supplied Logo into transparent/optimized web derivatives. Import only product imagery with documented permission; otherwise use clearly labeled first-party catalogue imagery or approved generated images. Record Alt text in all three languages.

```ts
export type ImportedImage = { sourcePath: string; rightsBasis: 'CLIENT_SUPPLIED' | 'LICENSED' | 'GENERATED'; alt: Record<Locale, string> }
```

- [ ] **Step 4: Run the importer and content audit**

```powershell
pnpm content:import
pnpm vitest run tests/import
```

Expected: 16 categories, two product lines, representative brands, default settings, contacts, social placeholders disabled until real URLs are entered, and no duplicate records.

- [ ] **Step 5: Commit content seeds**

```powershell
git add scripts prisma/seed.ts tests/import
git commit -m "content: import approved Hocore catalogue data"
```

### Task 17: Add E2E, accessibility, responsive, and visual verification

**Files:**
- Create: `e2e/public-site.spec.ts`
- Create: `e2e/admin.spec.ts`
- Create: `e2e/rfq.spec.ts`
- Create: `e2e/visual.spec.ts`
- Create: `tests/accessibility/critical-pages.test.tsx`
- Modify: `playwright.config.ts`

- [ ] **Step 1: Implement critical public journeys**

Test English root, EN/ZH/RU switching, full-width hero controls, catalogue filters, category RFQ prefill, WhatsApp URL, VK URL, resources and legal statements.

```ts
test('English is default and locale switching preserves context', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/en$/)
  await page.getByRole('link', { name: 'Products' }).click()
  await page.getByRole('button', { name: 'Language' }).click()
  await page.getByRole('menuitem', { name: 'Русский' }).click()
  await expect(page).toHaveURL(/\/ru\/products/)
})
```

- [ ] **Step 2: Implement admin journeys**

Log in, update site name, upload/replace a section image, create/edit/delete a draft category, publish it, verify the public page, and verify referenced media cannot be deleted.

```ts
test('admin publishes a category and protects referenced media', async ({ page }) => {
  await loginAsAdmin(page)
  const mediaId = await uploadFixtureImage(page, 'lab.jpg')
  await createAndPublishCategory(page, { key: 'test-category', mediaId })
  await expect(page.getByText('Published')).toBeVisible()
  await expectDeleteMediaConflict(page, mediaId)
})
```

- [ ] **Step 3: Implement RFQ journey**

Submit a valid RFQ with fixture XLSX, assert reference success, verify it in admin, download attachment as authorized user, update status, export CSV, and assert anonymous download is denied.

```ts
test('RFQ attachment remains private', async ({ request }) => {
  const created = await submitRfqFixture(request)
  const response = await request.get(created.attachmentUrl)
  expect(response.status()).toBe(401)
})
```

- [ ] **Step 4: Capture visual states**

Capture desktop 1440x1000, tablet 768x1024 and mobile 360x800 for EN/ZH/RU homepage, product catalogue, category, RFQ and admin editor. Assert no horizontal overflow and no blank hero image.

```ts
for (const viewport of [{ width: 1440, height: 1000 }, { width: 768, height: 1024 }, { width: 360, height: 800 }]) {
  test(`homepage has no horizontal overflow at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/en')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
```

- [ ] **Step 5: Run the full verification suite**

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm test:e2e
```

Expected: all commands pass; screenshots show no overlap, clipping or blank media.

- [ ] **Step 6: Commit verification coverage**

```powershell
git add e2e tests/accessibility playwright.config.ts
git commit -m "test: cover multilingual admin and RFQ journeys"
```

### Task 18: Add production Docker, backup, restore, and operations documentation

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `.dockerignore`
- Create: `scripts/backup.ps1`
- Create: `scripts/restore.ps1`
- Create: `docs/operations/deployment.md`
- Create: `docs/operations/backup-restore.md`
- Create: `tests/operations/backup-restore.test.ts`

- [ ] **Step 1: Build a single-instance persistent deployment**

Use a multi-stage Node image, run migrations before start, expose port 3000, and mount `/app/storage`. Configure one replica only and document that horizontal SQLite writers are unsupported.

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate && pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]
```

- [ ] **Step 2: Implement safe SQLite backup**

`backup.ps1` resolves the database and upload paths, verifies both are under the configured storage root, uses SQLite online backup or `VACUUM INTO`, archives uploads, writes SHA-256 manifests and retains 7 daily plus 4 weekly backups.

```powershell
$resolvedStorage = (Resolve-Path -LiteralPath $StorageRoot).Path
$resolvedDatabase = (Resolve-Path -LiteralPath $DatabasePath).Path
if (-not $resolvedDatabase.StartsWith($resolvedStorage, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'Database must be inside the configured storage root'
}
& sqlite3 $resolvedDatabase ".backup '$backupDatabase'"
Get-FileHash -Algorithm SHA256 -LiteralPath $backupDatabase | ConvertTo-Json | Set-Content -LiteralPath $manifestPath
```

- [ ] **Step 3: Implement guarded restore**

`restore.ps1` requires an explicit backup path, validates its manifest, refuses to restore while the app health endpoint reports writable traffic, restores to a temporary path, runs `PRAGMA integrity_check`, then atomically swaps files.

```powershell
if (-not (Test-Path -LiteralPath $BackupPath -PathType Leaf)) { throw 'Backup file not found' }
if ((Invoke-WebRequest -Uri "$AppUrl/api/health" -SkipHttpErrorCheck).StatusCode -eq 200) {
  throw 'Stop writable application traffic before restore'
}
$integrity = & sqlite3 $temporaryDatabase 'PRAGMA integrity_check;'
if ($integrity -ne 'ok') { throw "SQLite integrity check failed: $integrity" }
Move-Item -LiteralPath $temporaryDatabase -Destination $resolvedDatabase
```

- [ ] **Step 4: Test restore into a temporary directory**

Create fixture content and an RFQ attachment, back up, restore to a fresh temp location, and assert row counts, attachment hashes and `PRAGMA integrity_check = ok`.

```ts
expect(restored.categoryCount).toBe(source.categoryCount)
expect(restored.rfqCount).toBe(source.rfqCount)
expect(restored.attachmentSha256).toBe(source.attachmentSha256)
expect(restored.integrityCheck).toBe('ok')
```

- [ ] **Step 5: Final production verification**

```powershell
docker compose build
docker compose up -d
pnpm test:e2e
docker compose down
pnpm vitest run tests/operations
```

Expected: container is healthy, persistent content survives restart, E2E passes, and restore test passes.

- [ ] **Step 6: Commit deployment assets**

```powershell
git add Dockerfile docker-compose.yml .dockerignore scripts/backup.ps1 scripts/restore.ps1 docs/operations tests/operations
git commit -m "ops: add single-instance deployment and recovery"
```

## Final Acceptance Gate

- [ ] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm test:e2e` from a clean checkout.
- [ ] Verify the production container with a fresh SQLite volume and with a restored backup.
- [ ] Review EN/ZH/RU at desktop, tablet, and 360 px mobile widths.
- [ ] Confirm all 16 categories match the approved source documents.
- [ ] Confirm no public price, cart, payment, unsupported certificate, invented customer, or unverified service claim appears.
- [ ] Confirm WhatsApp and VK production URLs are entered through admin and open correctly.
- [ ] Confirm RFQ attachments are private and every admin mutation is audited.
- [ ] Confirm English is default and `hreflang`/canonical/sitemap output is correct.
- [ ] Tag the accepted release only after backup restore has been demonstrated.

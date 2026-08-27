# Hocore Biotech operations

The production deployment is a single Next.js instance with a persistent SQLite volume. Do not run multiple writers against the same database file.

## First deploy

1. Copy `.env.example` to `.env` and set a unique `ADMIN_PASSWORD`, `SESSION_COOKIE_NAME`, `APP_URL`, and SMTP values.
2. Run `pnpm prisma db push` and `pnpm db:seed` once against the persistent volume.
3. Start with `docker compose up -d --build` behind a TLS reverse proxy.

## Backups

Run `pnpm backup` daily. Set `DATABASE_FILE` and `BACKUP_ROOT` explicitly in the scheduler. Keep at least seven daily and four weekly copies, and test restores with `pnpm tsx scripts/restore.ts <backup-file>` against a stopped instance.

Uploaded RFQ attachments live below `storage/private` and must be included in the same backup policy. They are never served as public URLs.

## Content safety

Use the admin preview before publishing. Product pages are a sourcing directory: do not add public price, inventory, clinical, certification, or customer claims without source documentation.

UPDATE "SiteSetting"
SET "siteName" = 'ZEHOLYN BIOTECH',
    "siteNameZh" = 'ZEHOLYN BIOTECH',
    "siteNameRu" = 'ZEHOLYN BIOTECH',
    "logoUrl" = CASE WHEN "logoUrl" = '/hocore-logo.jpg' OR "logoUrl" = '' THEN '/manuals/company-logo.jpg' ELSE "logoUrl" END
WHERE "id" = 1;

UPDATE "HeroSlide"
SET "body" = REPLACE(REPLACE("body", 'Hocore', 'ZEHOLYN BIOTECH'), 'Zehongyan Biotech', 'ZEHOLYN BIOTECH'),
    "bodyZh" = REPLACE(REPLACE("bodyZh", 'Hocore', 'ZEHOLYN BIOTECH'), 'Zehongyan Biotech', 'ZEHOLYN BIOTECH'),
    "bodyRu" = REPLACE(REPLACE("bodyRu", 'Hocore', 'ZEHOLYN BIOTECH'), 'Zehongyan Biotech', 'ZEHOLYN BIOTECH'),
    "title" = REPLACE(REPLACE("title", 'Hocore', 'ZEHOLYN BIOTECH'), 'Zehongyan Biotech', 'ZEHOLYN BIOTECH'),
    "titleZh" = REPLACE(REPLACE("titleZh", 'Hocore', 'ZEHOLYN BIOTECH'), 'Zehongyan Biotech', 'ZEHOLYN BIOTECH'),
    "titleRu" = REPLACE(REPLACE("titleRu", 'Hocore', 'ZEHOLYN BIOTECH'), 'Zehongyan Biotech', 'ZEHOLYN BIOTECH');

UPDATE "Article"
SET "reviewer" = 'ZEHOLYN BIOTECH Technical & Supply Team'
WHERE lower("reviewer") LIKE '%hocore%' OR lower("reviewer") LIKE '%zehongyan%';

INSERT INTO "SocialLink" ("platform", "url", "displayValue", "imageUrl", "enabled", "sortOrder")
SELECT 'Max', 'mailto:luotan8888@qq.com', 'luotan8888@qq.com', '/contact/max.png', 1, 4
WHERE NOT EXISTS (SELECT 1 FROM "SocialLink" WHERE lower("platform") = 'max');

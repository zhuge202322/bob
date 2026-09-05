ALTER TABLE "ProductCategory" ADD COLUMN "level" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "ProductCategory" ADD COLUMN "parentId" INTEGER;
ALTER TABLE "Product" ADD COLUMN "citationNote" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Product" ADD COLUMN "sourceNote" TEXT NOT NULL DEFAULT '';
CREATE INDEX "ProductCategory_parentId_idx" ON "ProductCategory"("parentId");

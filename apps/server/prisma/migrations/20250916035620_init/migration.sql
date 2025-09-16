-- CreateTable
CREATE TABLE "investment_elements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "article_id" TEXT NOT NULL,
    "round" TEXT,
    "amount" TEXT,
    "currency" TEXT,
    "valuation" TEXT,
    "investors" TEXT,
    "counterparty" TEXT,
    "target_company" TEXT,
    "region" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "investment_elements_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "policy_elements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "article_id" TEXT NOT NULL,
    "issuing_org" TEXT,
    "document_no" TEXT,
    "scope" TEXT,
    "effective_date" TEXT,
    "key_points" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "policy_elements_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "company_elements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "article_id" TEXT NOT NULL,
    "company_name" TEXT,
    "brand_product" TEXT,
    "business_line" TEXT,
    "market_region" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "company_elements_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tech_elements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "article_id" TEXT NOT NULL,
    "direction" TEXT,
    "metrics" TEXT,
    "milestone" TEXT,
    "paper_patent_link" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tech_elements_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "split_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "article_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "original_link" TEXT NOT NULL,
    "split_index" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "split_events_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "processing_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" INTEGER NOT NULL DEFAULT 0,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER,
    "total_articles" INTEGER NOT NULL DEFAULT 0,
    "processed_articles" INTEGER NOT NULL DEFAULT 0,
    "success_articles" INTEGER NOT NULL DEFAULT 0,
    "failed_articles" INTEGER NOT NULL DEFAULT 0,
    "split_count" INTEGER NOT NULL DEFAULT 0,
    "duplicate_count" INTEGER NOT NULL DEFAULT 0,
    "filter_count" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "industries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "news_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_articles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mp_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "pic_url" TEXT NOT NULL,
    "publish_time" INTEGER NOT NULL,
    "summary" TEXT,
    "industry" TEXT,
    "news_type" TEXT,
    "confidence" REAL,
    "is_duplicate" BOOLEAN NOT NULL DEFAULT false,
    "duplicate_group_id" TEXT,
    "is_processed" BOOLEAN NOT NULL DEFAULT false,
    "processed_time" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_articles" ("created_at", "id", "mp_id", "pic_url", "publish_time", "title", "updated_at") SELECT "created_at", "id", "mp_id", "pic_url", "publish_time", "title", "updated_at" FROM "articles";
DROP TABLE "articles";
ALTER TABLE "new_articles" RENAME TO "articles";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "investment_elements_article_id_key" ON "investment_elements"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "policy_elements_article_id_key" ON "policy_elements"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_elements_article_id_key" ON "company_elements"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "tech_elements_article_id_key" ON "tech_elements"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "industries_name_key" ON "industries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "news_types_name_key" ON "news_types"("name");

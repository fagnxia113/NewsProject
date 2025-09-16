-- AlterTable
ALTER TABLE "industries" ADD COLUMN "description" TEXT;

-- AlterTable
ALTER TABLE "news_types" ADD COLUMN "description" TEXT;

-- CreateTable
CREATE TABLE "llm_configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "model" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "base_url" TEXT,
    "max_tokens" INTEGER,
    "temperature" REAL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

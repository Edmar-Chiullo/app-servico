-- AlterTable
ALTER TABLE "customers" ADD COLUMN "searchKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "customers_searchKey_key" ON "customers"("searchKey");

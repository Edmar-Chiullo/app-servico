-- DropForeignKey
ALTER TABLE "service_orders" DROP CONSTRAINT "service_orders_customerId_fkey";

-- DropIndex
DROP INDEX "customers_cpf_key";

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "cpf" DROP NOT NULL;

-- AlterTable
ALTER TABLE "service_orders" ADD COLUMN     "customerName" TEXT,
ALTER COLUMN "customerId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "financial_entries_serviceOrderId_idx" ON "financial_entries"("serviceOrderId");

-- CreateIndex
CREATE INDEX "ownership_histories_vehicleId_idx" ON "ownership_histories"("vehicleId");

-- CreateIndex
CREATE INDEX "ownership_histories_previousCustomerId_idx" ON "ownership_histories"("previousCustomerId");

-- CreateIndex
CREATE INDEX "ownership_histories_newCustomerId_idx" ON "ownership_histories"("newCustomerId");

-- CreateIndex
CREATE INDEX "ownership_histories_changedByUserId_idx" ON "ownership_histories"("changedByUserId");

-- CreateIndex
CREATE INDEX "status_histories_serviceOrderId_idx" ON "status_histories"("serviceOrderId");

-- CreateIndex
CREATE INDEX "stock_movements_productId_idx" ON "stock_movements"("productId");

-- CreateIndex
CREATE INDEX "stock_movements_orderId_idx" ON "stock_movements"("orderId");

-- CreateIndex
CREATE INDEX "whatsapp_messages_customerId_idx" ON "whatsapp_messages"("customerId");

-- AddForeignKey
ALTER TABLE "ownership_histories" ADD CONSTRAINT "ownership_histories_previousCustomerId_fkey" FOREIGN KEY ("previousCustomerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownership_histories" ADD CONSTRAINT "ownership_histories_newCustomerId_fkey" FOREIGN KEY ("newCustomerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

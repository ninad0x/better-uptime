/*
  Warnings:

  - You are about to drop the column `isActive` on the `Website` table. All the data in the column will be lost.
  - Changed the type of `currentStatus` on the `Website` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `finalStatus` on the `WebsiteMetric` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `WebsiteTick` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Website" DROP COLUMN "isActive",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "currentStatus",
ADD COLUMN     "currentStatus" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."WebsiteMetric" DROP COLUMN "finalStatus",
ADD COLUMN     "finalStatus" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."WebsiteTick" DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."WebsiteStatus";

-- CreateIndex
CREATE INDEX "WebsiteTick_websiteId_createdAt_idx" ON "public"."WebsiteTick"("websiteId", "createdAt");

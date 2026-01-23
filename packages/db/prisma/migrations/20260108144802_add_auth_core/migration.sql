/*
  Warnings:

  - You are about to drop the column `user_id` on the `Website` table. All the data in the column will be lost.
  - The primary key for the `WebsiteMetric` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avg_response_time_ms` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `final_status` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `regions_down_count` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `regions_down_list` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `uptime_percent` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `website_id` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `window_end` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `window_start` on the `WebsiteMetric` table. All the data in the column will be lost.
  - The primary key for the `WebsiteTick` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `WebsiteTick` table. All the data in the column will be lost.
  - You are about to drop the column `region_id` on the `WebsiteTick` table. All the data in the column will be lost.
  - You are about to drop the column `response_time_ms` on the `WebsiteTick` table. All the data in the column will be lost.
  - You are about to drop the column `website_id` on the `WebsiteTick` table. All the data in the column will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Website` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalStatus` to the `WebsiteMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionsDownCount` to the `WebsiteMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uptimePercent` to the `WebsiteMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `websiteId` to the `WebsiteMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windowEnd` to the `WebsiteMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windowStart` to the `WebsiteMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionId` to the `WebsiteTick` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseTimeMs` to the `WebsiteTick` table without a default value. This is not possible if the table is not empty.
  - Added the required column `websiteId` to the `WebsiteTick` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Website" DROP CONSTRAINT "Website_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."WebsiteMetric" DROP CONSTRAINT "WebsiteMetric_website_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."WebsiteTick" DROP CONSTRAINT "WebsiteTick_region_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."WebsiteTick" DROP CONSTRAINT "WebsiteTick_website_id_fkey";

-- DropIndex
DROP INDEX "public"."WebsiteMetric_website_id_window_start_idx";

-- AlterTable
ALTER TABLE "public"."Website" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."WebsiteMetric" DROP CONSTRAINT "WebsiteMetric_pkey",
DROP COLUMN "avg_response_time_ms",
DROP COLUMN "created_at",
DROP COLUMN "final_status",
DROP COLUMN "regions_down_count",
DROP COLUMN "regions_down_list",
DROP COLUMN "uptime_percent",
DROP COLUMN "website_id",
DROP COLUMN "window_end",
DROP COLUMN "window_start",
ADD COLUMN     "avgResponseTimeMs" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "finalStatus" "public"."WebsiteStatus" NOT NULL,
ADD COLUMN     "regionsDownCount" INTEGER NOT NULL,
ADD COLUMN     "regionsDownList" TEXT[],
ADD COLUMN     "uptimePercent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "websiteId" TEXT NOT NULL,
ADD COLUMN     "windowEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "windowStart" TIMESTAMPTZ NOT NULL,
ADD CONSTRAINT "WebsiteMetric_pkey" PRIMARY KEY ("id", "windowStart");

-- AlterTable
ALTER TABLE "public"."WebsiteTick" DROP CONSTRAINT "WebsiteTick_pkey",
DROP COLUMN "created_at",
DROP COLUMN "region_id",
DROP COLUMN "response_time_ms",
DROP COLUMN "website_id",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "regionId" TEXT NOT NULL,
ADD COLUMN     "responseTimeMs" INTEGER NOT NULL,
ADD COLUMN     "websiteId" TEXT NOT NULL,
ADD CONSTRAINT "WebsiteTick_pkey" PRIMARY KEY ("id", "createdAt");

-- DropTable
DROP TABLE "public"."Users";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "idToken" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "public"."Session"("token");

-- CreateIndex
CREATE INDEX "Account_accountId_providerId_idx" ON "public"."Account"("accountId", "providerId");

-- CreateIndex
CREATE INDEX "Verification_identifier_value_idx" ON "public"."Verification"("identifier", "value");

-- CreateIndex
CREATE INDEX "WebsiteMetric_websiteId_windowStart_idx" ON "public"."WebsiteMetric"("websiteId", "windowStart");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Website" ADD CONSTRAINT "Website_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteTick" ADD CONSTRAINT "WebsiteTick_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteTick" ADD CONSTRAINT "WebsiteTick_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "public"."Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteMetric" ADD CONSTRAINT "WebsiteMetric_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "public"."Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

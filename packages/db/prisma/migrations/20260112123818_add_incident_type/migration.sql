-- CreateEnum
CREATE TYPE "public"."IncidentType" AS ENUM ('Global', 'Regional');

-- AlterTable
ALTER TABLE "public"."Incident" ADD COLUMN     "type" "public"."IncidentType" NOT NULL DEFAULT 'Global';

/*
  Warnings:

  - Added the required column `status` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Incident" ADD COLUMN     "status" TEXT NOT NULL;

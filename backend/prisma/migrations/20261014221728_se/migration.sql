/*
  Warnings:

  - Added the required column `totalAPagar` to the `PlanDePago` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlanDePago" ADD COLUMN     "totalAPagar" INTEGER NOT NULL;

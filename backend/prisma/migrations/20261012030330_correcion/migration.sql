/*
  Warnings:

  - You are about to drop the column `fecheVencimientoCuota` on the `Cuota` table. All the data in the column will be lost.
  - Added the required column `fechaVencimientoCuota` to the `Cuota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cuota" DROP COLUMN "fecheVencimientoCuota",
ADD COLUMN     "fechaVencimientoCuota" TIMESTAMP(3) NOT NULL;

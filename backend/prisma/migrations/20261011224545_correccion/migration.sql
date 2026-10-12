/*
  Warnings:

  - The values [NIGNUNA] on the enum `FormaDePago` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FormaDePago_new" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'NINGUNA', 'OTROS');
ALTER TABLE "public"."Cuota" ALTER COLUMN "formaDePago" DROP DEFAULT;
ALTER TABLE "Cuota" ALTER COLUMN "formaDePago" TYPE "FormaDePago_new" USING ("formaDePago"::text::"FormaDePago_new");
ALTER TYPE "FormaDePago" RENAME TO "FormaDePago_old";
ALTER TYPE "FormaDePago_new" RENAME TO "FormaDePago";
DROP TYPE "public"."FormaDePago_old";
ALTER TABLE "Cuota" ALTER COLUMN "formaDePago" SET DEFAULT 'NINGUNA';
COMMIT;

-- AlterTable
ALTER TABLE "Cuota" ALTER COLUMN "formaDePago" SET DEFAULT 'NINGUNA';

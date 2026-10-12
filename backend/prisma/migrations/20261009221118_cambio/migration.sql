/*
  Warnings:

  - A unique constraint covering the columns `[idCliente]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numeroDNI]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cliente_idCliente_key" ON "Cliente"("idCliente");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_numeroDNI_key" ON "Cliente"("numeroDNI");

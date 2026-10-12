-- CreateEnum
CREATE TYPE "EstadoPrestamo" AS ENUM ('ACTIVO', 'FINALIZADO', 'ATRASADO');

-- CreateEnum
CREATE TYPE "EstadoCuota" AS ENUM ('PAGA', 'IMPAGA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "FormaDePago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'NINGUNA', 'OTROS');

-- CreateTable
CREATE TABLE "Cliente" (
    "idCliente" TEXT NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "numeroDNI" VARCHAR(10) NOT NULL,
    "email" VARCHAR(100),

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "Prestamo" (
    "idPrestamo" TEXT NOT NULL,
    "estadoPrestamo" "EstadoPrestamo" NOT NULL DEFAULT 'ACTIVO',
    "idCliente" TEXT NOT NULL,
    "montoPrestado" DECIMAL(12,2) NOT NULL,
    "porcentajeRecargo" DECIMAL(5,2) NOT NULL,
    "montoAdevolver" DECIMAL(12,2) NOT NULL,
    "fechaHoraOtorgado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaHoraFinalizado" TIMESTAMP(3),

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("idPrestamo")
);

-- CreateTable
CREATE TABLE "PlanDePago" (
    "idPlanDePago" TEXT NOT NULL,
    "cantidadCuotas" INTEGER NOT NULL,
    "diasEntreCuotas" INTEGER NOT NULL,
    "idPrestamo" TEXT NOT NULL,

    CONSTRAINT "PlanDePago_pkey" PRIMARY KEY ("idPlanDePago")
);

-- CreateTable
CREATE TABLE "Cuota" (
    "idCuota" TEXT NOT NULL,
    "estadoCuota" "EstadoCuota" NOT NULL DEFAULT 'IMPAGA',
    "formaDePago" "FormaDePago" NOT NULL DEFAULT 'NINGUNA',
    "numeroDeCuota" INTEGER NOT NULL,
    "montoCuota" DECIMAL(12,2) NOT NULL,
    "montoPagado" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "fechaInicioCuota" TIMESTAMP(3) NOT NULL,
    "fechaVencimientoCuota" TIMESTAMP(3) NOT NULL,
    "fechaHoraPagada" TIMESTAMP(3),
    "idPlanDePago" TEXT NOT NULL,

    CONSTRAINT "Cuota_pkey" PRIMARY KEY ("idCuota")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_numeroDNI_key" ON "Cliente"("numeroDNI");

-- CreateIndex
CREATE UNIQUE INDEX "PlanDePago_idPrestamo_key" ON "PlanDePago"("idPrestamo");

-- CreateIndex
CREATE UNIQUE INDEX "Cuota_idPlanDePago_numeroDeCuota_key" ON "Cuota"("idPlanDePago", "numeroDeCuota");

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanDePago" ADD CONSTRAINT "PlanDePago_idPrestamo_fkey" FOREIGN KEY ("idPrestamo") REFERENCES "Prestamo"("idPrestamo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuota" ADD CONSTRAINT "Cuota_idPlanDePago_fkey" FOREIGN KEY ("idPlanDePago") REFERENCES "PlanDePago"("idPlanDePago") ON DELETE RESTRICT ON UPDATE CASCADE;

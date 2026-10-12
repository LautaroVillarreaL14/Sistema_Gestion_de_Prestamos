-- CreateEnum
CREATE TYPE "EstadoPrestamo" AS ENUM ('ACTIVO', 'FINALIZADO', 'ATRASADO');

-- CreateEnum
CREATE TYPE "EstadoCuota" AS ENUM ('PAGA', 'IMPAGA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "FormaDePago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'NIGNUNA', 'OTROS');

-- CreateTable
CREATE TABLE "Cliente" (
    "idCliente" TEXT NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "numeroDNI" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "Prestamo" (
    "idPrestamo" TEXT NOT NULL,
    "estadoPrestamo" "EstadoPrestamo" NOT NULL DEFAULT 'ACTIVO',
    "ClienteId" TEXT NOT NULL,
    "montoPrestado" DECIMAL(10,2) NOT NULL,
    "porcentajeRecarco" DECIMAL(5,2) NOT NULL,
    "fechaHoraOtorigado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaHoraFinalizado" TIMESTAMP(3),

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("idPrestamo")
);

-- CreateTable
CREATE TABLE "PlandDePago" (
    "idPlanDePago" TEXT NOT NULL,
    "PrestamoId" TEXT NOT NULL,
    "cantidadCuotas" INTEGER NOT NULL,
    "diasEntreCuotas" INTEGER NOT NULL,

    CONSTRAINT "PlandDePago_pkey" PRIMARY KEY ("idPlanDePago")
);

-- CreateTable
CREATE TABLE "Cuota" (
    "idCuota" TEXT NOT NULL,
    "estadoCuota" "EstadoCuota" NOT NULL DEFAULT 'IMPAGA',
    "formaDePago" "FormaDePago" NOT NULL DEFAULT 'NIGNUNA',
    "numeroDeCuota" INTEGER NOT NULL,
    "montoCuota" DECIMAL(12,2) NOT NULL,
    "montoPagado" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "fechaInicioCuota" TIMESTAMP(3) NOT NULL,
    "fecheVencimientoCuota" TIMESTAMP(3) NOT NULL,
    "fechaHoraPagada" TIMESTAMP(3),

    CONSTRAINT "Cuota_pkey" PRIMARY KEY ("idCuota")
);

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_ClienteId_fkey" FOREIGN KEY ("ClienteId") REFERENCES "Cliente"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlandDePago" ADD CONSTRAINT "PlandDePago_PrestamoId_fkey" FOREIGN KEY ("PrestamoId") REFERENCES "Prestamo"("idPrestamo") ON DELETE RESTRICT ON UPDATE CASCADE;

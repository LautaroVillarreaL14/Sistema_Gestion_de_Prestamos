import { Injectable, NotFoundException } from "@nestjs/common";
import { IPlanesDePagoRepository } from "./planes-de-pago.repository.interface.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import {
    PlanDePago as PlanPrisma,
    Cuota as CuotaPrisma,
} from "../../generated/prisma/client.js";
import { PlanDePago } from "./planes-de-pago.entity.js";
import { Cuota } from "../../cuotas/entities/cuota.entity.js";

type PlanConCuotas = PlanPrisma & { cuotas: CuotaPrisma[] };

@Injectable()
export class PrismaPlanesRepository implements IPlanesDePagoRepository {
    constructor(private readonly prisma: PrismaService) {}

    async crearPlanDePago(plan: PlanDePago, idPrestamo: string): Promise<PlanDePago> {
        const nuevoPlan = await this.prisma.planDePago.create({
            data: {
                diasEntreCuotas: plan.diasEntreCuotas,
                totalAPagar: plan.totalAPagar,
                idPrestamo,
                cuotas: {
                    create: plan.cuotas.map(cuota => ({
                        numeroDeCuota: cuota.numeroDeCuota,
                        montoCuota: cuota.montoCuota,
                        montoPagado: cuota.montoPagado,
                        estadoCuota: cuota.estadoCuota,
                        formaDePago: cuota.formaDePago,
                        fechaInicioCuota: cuota.fechaInicioCuota,
                        fechaVencimientoCuota: cuota.fechaVencimientoCuota,
                        fechaHoraPagada: cuota.fechaHoraPagada,
                    })),
                },
            },
            include: { cuotas: true },
        });

        return this.toEntity(nuevoPlan);
    }

    async modificarPlanDePago(plan: PlanDePago): Promise<PlanDePago> {
        const planActualizado = await this.prisma.$transaction(async (tx) => {
            // 1. Actualizamos los datos propios del plan
            await tx.planDePago.update({
                where: { idPlanDePago: plan.idPlan },
                data: {
                    diasEntreCuotas: plan.diasEntreCuotas,
                    totalAPagar: plan.totalAPagar,
                },
            });

            // 2. Actualizamos cada cuota (ej: montos recalculados o cuota pagada)
            for (const cuota of plan.cuotas) {
                if (!cuota.idCuota) continue; // cuotas sin id todavía no existen en la BD

                await tx.cuota.update({
                    where: { idCuota: cuota.idCuota },
                    data: {
                        montoCuota: cuota.montoCuota,
                        montoPagado: cuota.montoPagado,
                        estadoCuota: cuota.estadoCuota,
                        formaDePago: cuota.formaDePago,
                        fechaVencimientoCuota: cuota.fechaVencimientoCuota,
                        fechaHoraPagada: cuota.fechaHoraPagada,
                    },
                });
            }

            // 3. Devolvemos el plan con sus cuotas ya actualizadas
            return tx.planDePago.findUniqueOrThrow({
                where: { idPlanDePago: plan.idPlan },
                include: { cuotas: { orderBy: { numeroDeCuota: "asc" } } },
            });
        });

        return this.toEntity(planActualizado);
    }

    async buscarPlanDepagoPorId(idPlan: string): Promise<PlanDePago> {
        const plan = await this.prisma.planDePago.findUnique({
            where: { idPlanDePago: idPlan },
            include: { cuotas: { orderBy: { numeroDeCuota: "asc" } } },
        });

        if (!plan) {
            throw new NotFoundException(`No existe el plan de pago con id ${idPlan}`);
        }

        return this.toEntity(plan);
    }

    // Convierte lo que devuelve Prisma en entidades de dominio
    private toEntity(planPrisma: PlanConCuotas): PlanDePago {
        const cuotas = planPrisma.cuotas.map(cuota =>
            Cuota.reconstruir({
                idCuota: cuota.idCuota,
                numeroDeCuota: cuota.numeroDeCuota,
                montoCuota: Number(cuota.montoCuota),
                montoPagado: Number(cuota.montoPagado),
                fechaInicioCuota: cuota.fechaInicioCuota,
                fechaVencimientoCuota: cuota.fechaVencimientoCuota,
                fechaHoraPagada: cuota.fechaHoraPagada,
                estadoCuota: cuota.estadoCuota,
                formaDePago: cuota.formaDePago,
            }),
        );

        return new PlanDePago(
            planPrisma.diasEntreCuotas,
            planPrisma.totalAPagar,
            cuotas,
            planPrisma.idPlanDePago,
        );
    }

    async buscarPlanDePagoPorPrestamo(idPrestamo: string): Promise<PlanDePago> {
        const plan = await this.prisma.planDePago.findUnique({
            where: { idPrestamo },
            include: { cuotas: { orderBy: { numeroDeCuota: "asc" } } },
        });

        if (!plan) {
            throw new NotFoundException(`No existe un plan de pago para el préstamo con id ${idPrestamo}`);
        }

        return this.toEntity(plan);
    }
}
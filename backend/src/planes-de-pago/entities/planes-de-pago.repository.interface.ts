import type { PlanDePago } from "./planes-de-pago.entity.js"
export const IPlanesDePagoRepositoryToken = Symbol('IPlanesDePagoRepository');

export interface IPlanesDePagoRepository {
    crearPlanDePago(plan: PlanDePago, idPrestamo: string): Promise<PlanDePago>;
    modificarPlanDePago(plan: PlanDePago): Promise<PlanDePago>;
    buscarPlanDepagoPorId(IdPlan: string): Promise<PlanDePago>;
    buscarPlanDePagoPorPrestamo(idPrestamo: string): Promise<PlanDePago>

}

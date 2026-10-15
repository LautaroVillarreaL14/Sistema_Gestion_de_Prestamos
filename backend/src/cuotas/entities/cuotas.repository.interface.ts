import type { Cuota } from "./cuota.entity.js" 
export const ICuotasRepositoryToken = Symbol('ICuotasRepository');

export interface ICuotasRepository {
    crearCuota(cuota: Cuota, idPlan: string): Promise<Cuota>
    guardarCuota(cuota: Cuota): Promise<Cuota>
    buscarCuotaPorId(idCuota: string): Promise<Cuota | null>
    //buscarCuotaPorPlan(idPlan: string): Promise<Cuota[]>
}


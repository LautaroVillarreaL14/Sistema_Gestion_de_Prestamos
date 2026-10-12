import type { Cuota } from "./cuota.entity.js" 

export interface ICuotasRepository {
    crearCuota(cuota: Cuota, idPlan: string): Promise<Cuota>
    guardarCuota(cuota: Cuota): Promise<Cuota>
    buscarCuotaPorId(idCuota: string): Promise<Cuota | null>
    //buscarCuotaPorPlan(idPlan: string): Promise<Cuota[]>
}

export const ICuotasRepositoryToken = Symbol('ICuotasRepository');
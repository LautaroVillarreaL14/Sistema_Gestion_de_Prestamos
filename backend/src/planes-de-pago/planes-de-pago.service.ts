import { Injectable, Inject } from '@nestjs/common';
import type { IPlanesDePagoRepository } from './entities/planes-de-pago.repository.interface.js';
import { IPlanesDePagoRepositoryToken } from './entities/planes-de-pago.repository.interface.js';
import { PlanDePago } from './entities/planes-de-pago.entity.js';
import { Cuota } from '../cuotas/entities/cuota.entity.js';
import { EstadoCuota } from '../generated/prisma/enums.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
const { Decimal } = Prisma;

@Injectable()
export class PlanesDePagoService {
  constructor(
    @Inject(IPlanesDePagoRepositoryToken)
    private readonly planesRepository: IPlanesDePagoRepository
  ){}

  async generarPlanDePago(idPrestamo: string, cantidadCuotas: number, diasEntreCuotas: number, montoPrestado: number, porcentaRecargo: number): Promise<PlanDePago> {
    if(cantidadCuotas<=0 || diasEntreCuotas<=0 || montoPrestado<=0) throw new BadRequestException('Debe generar un plan de pago con datos validos')
      const monto = new Decimal(montoPrestado);
      const totalAPagar = monto.plus(monto.times(porcentaRecargo).div(100)).toDecimalPlaces(2)
    const nuevoPlan = PlanDePago.generarPlanDePago(cantidadCuotas,diasEntreCuotas,totalAPagar);
    return await this.planesRepository.crearPlanDePago(nuevoPlan, idPrestamo);
  }

  async agregarCuotasAlPlan(cantidadCuotasAgregar: number, idPlan: string): Promise<PlanDePago> {
    if(cantidadCuotasAgregar<=0) throw new BadRequestException('Debe agregar un numero de cuotas valido')
    const planActualizar = await this.buscarPlanPorId(idPlan)
    planActualizar.agregarCuota(cantidadCuotasAgregar);
    await this.planesRepository.modificarPlanDePago(planActualizar);
    return planActualizar;
  }

  async quitarCuotasAlPlan(cantidadCuotasQuitar: number, idPlan: string): Promise<PlanDePago> {
    if(cantidadCuotasQuitar<=0) throw new BadRequestException('Debe quitar un numero de cuotas valido')
    const planActualizar = await this.buscarPlanPorId(idPlan);
    planActualizar.quitarCuotasPlan(cantidadCuotasQuitar);
    await this.planesRepository.modificarPlanDePago(planActualizar);
    return planActualizar;
  }

  async buscarPlanPorId(idPlan: string): Promise<PlanDePago> {
    const plan = await this.planesRepository.buscarPlanDepagoPorId(idPlan)
    if(!plan) throw new NotFoundException('No se encontro un plan');
    return plan;
  }

  async buscarPlanPorPrestamo(idPrestamo: string): Promise<PlanDePago>{
    const prestamo = await this.planesRepository.buscarPlanDePagoPorPrestamo(idPrestamo);
    if(!prestamo) throw new NotFoundException('No se encontro un prestamo')
    return prestamo;
    
  }

  async obtenerCuotasPlan(idPlan: string, estadoCuota?: EstadoCuota): Promise<Cuota[]> {
    const plan = await this.buscarPlanPorId(idPlan);
    return plan.obtenerCuotas(estadoCuota);
  }

  async contarCuotasPendientes(idPlan: string): Promise<number> {
    const plan = await this.buscarPlanPorId(idPlan);
    return plan.obtenerCuotasPendientes().length
  }

  async recalcularCuotasRestantes(idPlan: string): Promise<PlanDePago> {
    const plan =await this.buscarPlanPorId(idPlan);
    plan.actualizarCuotasPendientes();
    await this.planesRepository.modificarPlanDePago(plan)
    return plan;
    
  }

  
}

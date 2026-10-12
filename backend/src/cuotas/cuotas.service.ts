import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Cuota } from './entities/cuota.entity.js';
import { FormaDePago } from '../generated/prisma/enums.js';
import type { ICuotasRepository} from './entities/cuotas.repository.interface.js';
import { ICuotasRepositoryToken } from './entities/cuotas.repository.interface.js';

@Injectable()
export class CuotasService {

  constructor(
    @Inject(ICuotasRepositoryToken)
    private readonly cuotasRepository: ICuotasRepository
  ){}

  async crearCuota(montoCuota: number, numeroCuota: number, fechaInicio: Date, diasEntreCuotas: number, idPlanDePago: string): Promise<Cuota> {
    const nuevaCuota = Cuota.crear(montoCuota, numeroCuota, fechaInicio, diasEntreCuotas)
    return this.cuotasRepository.crearCuota(nuevaCuota,idPlanDePago)
  }

  async buscarCuota(idCuota: string): Promise<Cuota>{
    const cuota = await this.cuotasRepository.buscarCuotaPorId(idCuota)
    if(!cuota) throw new NotFoundException('No se encontro una cuota')
      return cuota
  }

  async actualizarMonto(nuevoMonto: number, idCuota: string): Promise<Cuota> {
    const cuota = await this.buscarCuota(idCuota)
    cuota.actualizarMonto(nuevoMonto)
    return this.cuotasRepository.guardarCuota(cuota);
  }

  async pagarCuota(idCuota: string, montoAPagar: number, formaDePago: FormaDePago): Promise<{cuota: Cuota, diferencia: number}> {
    const cuota = await this.buscarCuota(idCuota)

    const diferencia = cuota.pagar(montoAPagar, formaDePago)

    const cuotaGuardar = await this.cuotasRepository.guardarCuota(cuota)
    //Devolvemos una diferencia ya que cada que se paga una cuota, el plan de pago debe actualiazar el monto individual de cada cuota
    return {cuota: cuotaGuardar, diferencia}

  }

  async establecerVencida(idCuota: string): Promise<Cuota> {
    const cuota = await this.buscarCuota(idCuota);
    cuota.establecerVencida();
    return this.cuotasRepository.guardarCuota(cuota);
  }
}

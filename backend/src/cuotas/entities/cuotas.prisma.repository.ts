import { Injectable } from "@nestjs/common";
import { ICuotasRepository } from "./cuotas.repository.interface.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Cuota as CuotaPrisma} from "../../generated/prisma/client.js";
import { Cuota } from "./cuota.entity.js";

@Injectable()
export class PrismaCuotasRepository implements ICuotasRepository{
    constructor(private readonly prisma: PrismaService){}

    async crearCuota(cuota: Cuota, idPlanDePago: string): Promise<Cuota> {
        const nuevaCuota = await this.prisma.cuota.create({
            data : {
                numeroDeCuota: cuota.numeroDeCuota,
                montoCuota: cuota.montoCuota,
                montoPagado: cuota.montoPagado,
                estadoCuota: cuota.estadoCuota,
                formaDePago: cuota.formaDePago,
                fechaInicioCuota: cuota.fechaInicioCuota,
                fechaVencimientoCuota: cuota.fechaVencimientoCuota,
                planDePago : { connect : { idPlanDePago }},
            },

        });
        return this.toEntity(nuevaCuota);
    }

    async guardarCuota(cuota: Cuota): Promise<Cuota> {
        if(cuota.idCuota===undefined){
            throw new Error('La cuota no existe')
        }
        const cuotaActualizada = await this.prisma.cuota.update({
            where : {idCuota : cuota.idCuota},
            data : {
                estadoCuota: cuota.estadoCuota,
                montoCuota: cuota.montoCuota,
                montoPagado: cuota.montoPagado,
                fechaHoraPagada: cuota.fechaHoraPagada,
                formaDePago: cuota.formaDePago
                
            },
        });
        return this.toEntity(cuotaActualizada)
        
    }

    private toEntity(datos: CuotaPrisma): Cuota {
        return new Cuota(
            datos.idCuota,
            datos.montoCuota.toNumber(),
            datos.numeroDeCuota,
            datos.fechaInicioCuota,
            datos.fechaVencimientoCuota,
            datos.montoPagado.toNumber(),
            datos.estadoCuota,
            datos.formaDePago,
            datos.fechaHoraPagada
        )
    }

    async buscarCuotaPorId(idCuota: string): Promise<Cuota | null> {
        const cuota = await this.prisma.cuota.findUnique({
            where : { idCuota: idCuota }
        });
        if(!cuota) return null

        return this.toEntity(cuota)
    }
}
import { Decimal } from "@prisma/client/runtime/client";
import { Cuota } from "../../cuotas/entities/cuota.entity.js";
import { EstadoCuota } from "../../generated/prisma/enums.js";


export class PlanDePago {
    constructor(
       
        public diasEntreCuotas: number,
        public totalAPagar: Decimal,
        public cuotas: Cuota[],
        public readonly idPlan? : string,
    ){}

    /*private static calcularMontoCuota(cantidadCuotas: number, totalAPagar: number): number {
        return totalAPagar/cantidadCuotas;
    }*/

    private static calcularMontoCuota(totalAPagar: Decimal, cantidadCuotas: number): Decimal[] {
    if(!Number.isInteger(cantidadCuotas) || cantidadCuotas <= 0) throw new Error('La cantidad de cuotas debe ser un entero positivo')
    //calculamos el monto base de cada cuota
    const base = totalAPagar.div(cantidadCuotas).toDecimalPlaces(2, Decimal.ROUND_DOWN);

    //calculamos el monto para la ultima cuota (sera la que absorba la diferencia por los decimales)
    const montos: Decimal[] = Array(cantidadCuotas).fill(base);
    montos[cantidadCuotas - 1] = totalAPagar.minus(base.times(cantidadCuotas - 1));
    return montos;
}

    static generarPlanDePago(cantidadCuotas: number, diasEntreCuotas: number, totalAPagar: Decimal): PlanDePago{
        const montoCuota = this.calcularMontoCuota(totalAPagar, cantidadCuotas)
        const cuotas: Cuota[] = [];
        let fechaInicio = new Date();
        for(let numeroCuota = 1;numeroCuota<=cantidadCuotas;numeroCuota++){
            const cuota = this.crearCuotaParaPlan(montoCuota[numeroCuota-1].toNumber(),numeroCuota,fechaInicio,diasEntreCuotas);
            cuotas.push(cuota)
            fechaInicio = cuota.fechaVencimientoCuota;
        }
        return new PlanDePago(diasEntreCuotas, totalAPagar, cuotas)
    }

    private static crearCuotaParaPlan(monto: number, numeroCuota: number, fechaInicio: Date, diasEntreCuotas: number): Cuota {
        return Cuota.crear(monto, numeroCuota,fechaInicio,diasEntreCuotas)
    }

    public agregarCuota(cantidadCuotasAgregar: number): PlanDePago {
        //tomamos la ultima cuota como base para crear las siguientes
        const ultimaCuota = this.cuotas[this.cuotas.length-1]
        let nuevaFechaInicio = ultimaCuota.fechaVencimientoCuota;

        for(let copiaUltimaCuota=1;copiaUltimaCuota<=cantidadCuotasAgregar;copiaUltimaCuota++){
            const nuevoNumeroCuota = ultimaCuota.numeroDeCuota+copiaUltimaCuota
            

            const cuota = PlanDePago.crearCuotaParaPlan(ultimaCuota.montoCuota,nuevoNumeroCuota,nuevaFechaInicio,this.diasEntreCuotas);
            this.cuotas.push(cuota);
            nuevaFechaInicio = cuota.fechaVencimientoCuota;
        }

        //actualizamos el monto de las cuotas impagas, las que estaban y las que acabamos de agregar
        this.actualizarCuotasPendientes();

        
        return this
    }

    public actualizarCuotasPendientes(): PlanDePago{
        
        //bucamos las cuotas que quedan por pagar
        const pendientes = this.obtenerCuotasPendientes();
        //si no hay cuotas por pagar, simplemente salimos
        if(pendientes.length===0) return this

        //calculamos el total que queda por pagar
        const faltaPagar = this.totalAPagar.minus(this.calcularTotalPagado());
        
        //calculamos el nuevo monto para cada una de las cuotas pendientes
        const nuevoMonto = PlanDePago.calcularMontoCuota(faltaPagar,this.contarCuotasImpagas())

        //actualizamos cada cuota con su monto calculado, incluido el ajuste de la ultima
        pendientes.forEach((cuota, i) => cuota.actualizarMonto(nuevoMonto[i].toNumber()));
        return this;

    }

    public quitarCuotasPlan(cantidadCuotasQuitar: number): PlanDePago {
        if (!Number.isInteger(cantidadCuotasQuitar) || cantidadCuotasQuitar <= 0) throw new Error('La cantidad de cuotas a quitar debe ser un entero positivo');

        const cuotasImpagas = this.contarCuotasImpagas();
        if (cuotasImpagas === 0) throw new Error('No quedan cuotas para quitar');
        
        // Siempre debe quedar al menos una cuota pendiente, si no el total a pagar quedaría sin cubrir
        if (cantidadCuotasQuitar >= cuotasImpagas) throw new Error(`Solo se pueden quitar hasta ${cuotasImpagas - 1} cuotas (debe quedar al menos una pendiente)`);

        // Recorremos desde el final y eliminamos las cuotas que aún no se pagaron
        let cuotasQuitadas = 0;
        for (let i = this.cuotas.length - 1; i >= 0 && cuotasQuitadas < cantidadCuotasQuitar; i--) {
            if (this.cuotas[i].estadoCuota !== EstadoCuota.PAGA) {
                this.cuotas.splice(i, 1);
                cuotasQuitadas++;
            }
        }

        // Redistribuimos lo que falta pagar entre las cuotas pendientes que quedaron
        this.actualizarCuotasPendientes();

        return this;
    }



    public calcularTotalPagado(): Decimal {
        let totalPagado = new Decimal(0);
        for (const cuota of this.cuotas) {
            if (cuota.estadoCuota === EstadoCuota.PAGA) {
                totalPagado = totalPagado.plus(cuota.montoPagado);
            }
        }
        return totalPagado.toDecimalPlaces(2, Decimal.ROUND_DOWN);
    }

    public conocerCuotas(): Cuota[] {
        return this.cuotas
    }

    public contarCuotasImpagas(): number {
        return this.cuotas.filter(cuota=>cuota.estadoCuota===EstadoCuota.IMPAGA).length + this.cuotas.filter(cuota=>cuota.estadoCuota===EstadoCuota.VENCIDA).length;
         
    }

    public obtenerCuotas(estadoCuota?: EstadoCuota): Cuota[] {
        if(!estadoCuota) return this.cuotas
        return this.cuotas.filter(cuota=>cuota.estadoCuota===estadoCuota)
    }

    public obtenerCuotasPendientes(): Cuota[] {
        const pendientes: Cuota[] = this.cuotas.filter(cuota=>cuota.estadoCuota!==EstadoCuota.PAGA)
        return pendientes;
        
    }


    
    

}

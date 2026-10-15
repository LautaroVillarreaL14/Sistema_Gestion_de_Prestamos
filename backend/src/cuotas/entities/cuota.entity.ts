import { EstadoCuota, FormaDePago } from "../../generated/prisma/enums.js";

export class Cuota {
    constructor(
        public readonly idCuota: string | undefined,
        public montoCuota: number,
        public readonly numeroDeCuota: number,
        public fechaInicioCuota: Date,
        public fechaVencimientoCuota: Date,
        public montoPagado: number = 0,
        public estadoCuota: EstadoCuota = EstadoCuota.IMPAGA,
        public formaDePago: FormaDePago = FormaDePago.NINGUNA,
        public fechaHoraPagada: Date | null = null
    ){}

    //metodo de creaion de Cuota, calcula la fecha de vencimiento, luego crea una Cuota usando el metodo constructor
    static crear(montoCuota: number, numeroCuota: number, fechaInicio: Date, diasEntreCuotas: number) : Cuota{
        const fechaVencimiento = Cuota.calcularFechaVencimiento(fechaInicio,diasEntreCuotas)
        return new Cuota(undefined,montoCuota,numeroCuota,fechaInicio,fechaVencimiento,0,EstadoCuota.IMPAGA,FormaDePago.NINGUNA,null)
    }

    private static calcularFechaVencimiento(fechaInicio: Date, diasEntreCuotas: number): Date {
        //creamos un objeto Date con la fecha que recimbimos
        const fechaVencimiento = new Date(fechaInicio);

        //establecemos una nueva fecha de venicmiento extrayendo el numero de dia de fechaVencimiento y sumandole los dias que pasan entre cada cuota
        fechaVencimiento.setDate(fechaVencimiento.getDate()+diasEntreCuotas);

        //devolvemos la fecha de vencimiento para establecersela a la cuota
        return fechaVencimiento;
    }

    public actualizarMonto(nuevoMonto: number): Cuota {
        if(nuevoMonto<0){
            throw new Error('El monto de la cuota no puede ser menor a $0')
        }
        if(this.estadoCuota===EstadoCuota.PAGA){
            throw new Error('No se puede modificar el monto de una cuota ya pagada')
        }
        this.montoCuota = nuevoMonto;
        return this
    }

    public pagar(montoAPagar: number, formaDePago: FormaDePago): number {
        if(montoAPagar<0){
            throw new Error('No se puede pagar un monto menor a $0')
        }
        if(this.estadoCuota===EstadoCuota.PAGA){
            throw new Error('La cuota ya está pagada')
        }
        this.montoPagado = montoAPagar;
        this.formaDePago = formaDePago;
        this.fechaHoraPagada = new Date();
        this.estadoCuota = EstadoCuota.PAGA
        const recalcularCuotas = this.montoCuota - montoAPagar;
        return this.montoCuota - montoAPagar;
    }

    public establecerVencida(): void {
        this.estadoCuota = EstadoCuota.VENCIDA;
    }

    public conocerEstado(): EstadoCuota {
        return this.estadoCuota;
    }

    static reconstruir(datos: {
        idCuota: string;
        numeroDeCuota: number;
        montoCuota: number;
        montoPagado: number;
        fechaInicioCuota: Date;
        fechaVencimientoCuota: Date;
        fechaHoraPagada: Date | null;
        estadoCuota: EstadoCuota;
        formaDePago: FormaDePago;

        }): Cuota {
            return new Cuota(
                datos.idCuota,
                datos.montoCuota,
                datos.numeroDeCuota,
                datos.fechaInicioCuota,
                datos.fechaVencimientoCuota,
                datos.montoPagado,
                datos.estadoCuota,
                datos.formaDePago,
                datos.fechaHoraPagada
            );
    }




}

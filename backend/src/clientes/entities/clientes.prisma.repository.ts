import { Injectable } from "@nestjs/common";
import { IClientesRepository } from "./clientes.repository.interface.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Cliente } from "../../generated/prisma/client.js";
import { CreateClienteDto } from "../dto/create-cliente.dto.js";
import { UpdateClienteDto } from "../dto/update-cliente.dto.js";

@Injectable()
export class PrismaClientesRepository implements IClientesRepository {
    constructor(private readonly prisma: PrismaService){}


    async crearCliente(datosCliente: CreateClienteDto): Promise<Cliente> {
        return await this.prisma.cliente.create({
            data: datosCliente,
        });
    }

    async buscarClientes(): Promise<Cliente[]> {
        return await this.prisma.cliente.findMany()
    }

    async buscarClientePorDNI(DNICliente: string): Promise<Cliente | null> {
        

        //filtramos la lista de clientes
        const clienteEncontrado = await this.prisma.cliente.findUnique({
            where:{numeroDNI: DNICliente}
        })

        //devolvermos el cliente encontrado o null si no hay cliente con ese dni registrado
        return clienteEncontrado;
    }

    async buscarClientePorId(idCliente: string): Promise<Cliente | null>{
        return await this.prisma.cliente.findUnique({
            where: {idCliente: idCliente}
        })
    }

    async modificarCliente(numeroDNI: string, nuevosDatosCliente: UpdateClienteDto): Promise<Cliente> {

        return await this.prisma.cliente.update({
            where : {numeroDNI : numeroDNI},
            data : nuevosDatosCliente
        })
        
    }

    





}
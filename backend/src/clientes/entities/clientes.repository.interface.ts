import { CreateClienteDto } from '../dto/create-cliente.dto.js'
import { UpdateClienteDto } from '../dto/update-cliente.dto.js'
import type { Cliente } from '../../generated/prisma/client.js'
import { CipherNameAndProtocol } from 'tls';

export interface IClientesRepository {
    crearCliente(datosCliente: CreateClienteDto): Promise<Cliente>;
    buscarClientes(): Promise<Cliente[]>
    buscarClientePorDNI(DNICliente: string): Promise<Cliente | null>
    buscarClientePorId(idCliente: string): Promise<Cliente | null> 
    modificarCliente(idCliente: string, nuevosDatosCliente: UpdateClienteDto): Promise<Cliente>

    
}
export const IClienteRepositoryToken = Symbol('IClienteRepository');
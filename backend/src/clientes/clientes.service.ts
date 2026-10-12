import { Inject, Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { IClienteRepositoryToken } from './entities/clientes.repository.interface.js';
import type { IClientesRepository } from './entities/clientes.repository.interface.js';
import { Cliente} from '../generated/prisma/client.js'
@Injectable()
export class ClientesService {

  constructor(
    @Inject(IClienteRepositoryToken)
    private readonly clientesRepository: IClientesRepository,
  ) {}

  async crearCliente(datosCliente: CreateClienteDto){
    if(await this.obtenerClientePorDNI(datosCliente.numeroDNI)){
      throw new ConflictException('DNI ya registrado')
    } 
    return await this.clientesRepository.crearCliente(datosCliente)
  }


  async buscarClientes(): Promise<Cliente[]> {
    const clientes = await this.clientesRepository.buscarClientes()
    if(clientes.length>0){
      return clientes
    }
    else{
      throw new NotFoundException('No hay clientes registrados')
    }
    
  }

  async obtenerClientePorDNI(numeroDNI: string): Promise<Cliente | null > {
    return await this.clientesRepository.buscarClientePorDNI(numeroDNI)
  }

  async buscarClientePorDNI(numeroDNI: string): Promise<Cliente>{
    const cliente = await this.clientesRepository.buscarClientePorDNI(numeroDNI)
    if(!cliente){
      throw new NotFoundException('Cliente no encontrado')
    }
    return cliente
  }


  validadorDNI(numeroDNI: string): boolean {
    const soloNumeros = /^\d+$/;
    if(soloNumeros.test(numeroDNI) && numeroDNI.length<=10){
      return true
    }
    else {
      throw new BadRequestException('Debe ingresar un DNI valido')
    }
  }

  async modificarCliente(numeroDNI: string, nuevosDatosCliente: UpdateClienteDto): Promise<Cliente> {
    this.validadorDNI(numeroDNI);
    await this.clientesRepository.buscarClientePorDNI(numeroDNI);
    return await this.clientesRepository.modificarCliente(numeroDNI, nuevosDatosCliente)
  }

  
}

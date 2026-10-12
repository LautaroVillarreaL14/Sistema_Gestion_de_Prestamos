import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  crearCliente(@Body() crearClienteDto: CreateClienteDto) {
    return this.clientesService.crearCliente(crearClienteDto);
  }

  @Get()
  buscarClientes() {
    return this.clientesService.buscarClientes();
  }

  @Get(':dni')
  findOne(@Param('dni') numeroDNI: string) {
    return this.clientesService.buscarClientePorDNI(numeroDNI);
  }

  @Patch(':dni')
  update(@Param('dni') numeroDNI: string ,@Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.modificarCliente(numeroDNI, updateClienteDto)
  }

}

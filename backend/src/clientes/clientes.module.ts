import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service.js';
import { ClientesController } from './clientes.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PrismaClientesRepository } from './entities/clientes.prisma.repository.js';
import { IClienteRepositoryToken } from './entities/clientes.repository.interface.js';

@Module({
  imports: [PrismaModule],
  controllers: [ClientesController],
  providers: [
    ClientesService,
    {
      provide: IClienteRepositoryToken,
      useClass: PrismaClientesRepository,
    },
  ],
  exports: [ClientesService],
})
export class ClientesModule {}

import { Module } from '@nestjs/common';
import { CuotasService } from './cuotas.service.js';
import { PrismaCuotasRepository } from './entities/cuotas.prisma.repository.js';
import { ICuotasRepositoryToken } from './entities/cuotas.repository.interface.js';
import { PrismaModule } from '../prisma/prisma.module.js';


@Module({
  imports: [PrismaModule],
  providers: [
    CuotasService,
    {
      provide: ICuotasRepositoryToken,
      useClass: PrismaCuotasRepository,
    },
  ],
  exports: [CuotasService]
})
export class CuotasModule {}

import { Module } from '@nestjs/common';
import { CuotasService } from './cuotas.service.js';
import { PrismaCuotasRepository } from './entities/cuotas.prisma.repository.js';


@Module({
  providers: [CuotasService, PrismaCuotasRepository],
  exports: [CuotasService]
})
export class CuotasModule {}

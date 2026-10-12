import { Module } from '@nestjs/common';
import { CuotasService } from './cuotas.service.js';
import { CuotasController } from './cuotas.controller.js';

@Module({
  controllers: [CuotasController],
  providers: [CuotasService],
})
export class CuotasModule {}

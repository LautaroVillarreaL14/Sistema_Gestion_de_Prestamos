import { Module } from '@nestjs/common';
import { PlanesDePagoService } from './planes-de-pago.service.js';
import { PlanesDePagoController } from './planes-de-pago.controller.js';

@Module({
  controllers: [PlanesDePagoController],
  providers: [PlanesDePagoService],
})
export class PlanesDePagoModule {}

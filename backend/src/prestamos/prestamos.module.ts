import { Module } from '@nestjs/common';
import { PrestamosService } from './prestamos.service.js';
import { PrestamosController } from './prestamos.controller.js';

@Module({
  controllers: [PrestamosController],
  providers: [PrestamosService],
})
export class PrestamosModule {}

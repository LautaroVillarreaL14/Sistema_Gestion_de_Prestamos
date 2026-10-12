import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { ClientesModule } from './clientes/clientes.module.js';
import { PlanesDePagoModule } from './planes-de-pago/planes-de-pago.module.js';
import { CuotasModule } from './cuotas/cuotas.module.js';
import { PrestamosModule } from './prestamos/prestamos.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    ClientesModule,
    PrestamosModule,
    CuotasModule,
    PlanesDePagoModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { PlanesDePagoController } from './planes-de-pago.controller.js';
import { PlanesDePagoService } from './planes-de-pago.service.js';

describe('PlanesDePagoController', () => {
  let controller: PlanesDePagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanesDePagoController],
      providers: [PlanesDePagoService],
    }).compile();

    controller = module.get<PlanesDePagoController>(PlanesDePagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

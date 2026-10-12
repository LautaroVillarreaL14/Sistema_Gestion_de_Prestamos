import { Test, TestingModule } from '@nestjs/testing';
import { PlanesDePagoService } from './planes-de-pago.service.js';

describe('PlanesDePagoService', () => {
  let service: PlanesDePagoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanesDePagoService],
    }).compile();

    service = module.get<PlanesDePagoService>(PlanesDePagoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

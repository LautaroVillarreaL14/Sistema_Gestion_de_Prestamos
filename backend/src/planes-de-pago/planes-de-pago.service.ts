import { Injectable } from '@nestjs/common';
import { CreatePlanesDePagoDto } from './dto/create-planes-de-pago.dto.js';
import { UpdatePlanesDePagoDto } from './dto/update-planes-de-pago.dto.js';

@Injectable()
export class PlanesDePagoService {
  create(createPlanesDePagoDto: CreatePlanesDePagoDto) {
    return 'This action adds a new planesDePago';
  }

  findAll() {
    return `This action returns all planesDePago`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planesDePago`;
  }

  update(id: number, updatePlanesDePagoDto: UpdatePlanesDePagoDto) {
    return `This action updates a #${id} planesDePago`;
  }

  remove(id: number) {
    return `This action removes a #${id} planesDePago`;
  }
}

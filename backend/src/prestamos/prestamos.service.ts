import { Injectable } from '@nestjs/common';
import { CreatePrestamoDto } from './dto/create-prestamo.dto.js';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto.js';

@Injectable()
export class PrestamosService {
  create(createPrestamoDto: CreatePrestamoDto) {
    return 'This action adds a new prestamo';
  }

  findAll() {
    return `This action returns all prestamos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prestamo`;
  }

  update(id: number, updatePrestamoDto: UpdatePrestamoDto) {
    return `This action updates a #${id} prestamo`;
  }

  remove(id: number) {
    return `This action removes a #${id} prestamo`;
  }
}

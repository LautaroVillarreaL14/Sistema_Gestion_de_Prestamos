import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanesDePagoService } from './planes-de-pago.service.js';
import { CreatePlanesDePagoDto } from './dto/create-planes-de-pago.dto.js';
import { UpdatePlanesDePagoDto } from './dto/update-planes-de-pago.dto.js';

@Controller('planes-de-pago')
export class PlanesDePagoController {
  constructor(private readonly planesDePagoService: PlanesDePagoService) {}

  @Post()
  create(@Body() createPlanesDePagoDto: CreatePlanesDePagoDto) {
    return this.planesDePagoService.create(createPlanesDePagoDto);
  }

  @Get()
  findAll() {
    return this.planesDePagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planesDePagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanesDePagoDto: UpdatePlanesDePagoDto) {
    return this.planesDePagoService.update(+id, updatePlanesDePagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planesDePagoService.remove(+id);
  }
}

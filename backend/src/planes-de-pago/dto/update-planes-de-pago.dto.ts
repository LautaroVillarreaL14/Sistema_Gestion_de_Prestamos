import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanesDePagoDto } from './create-planes-de-pago.dto.js';

export class UpdatePlanesDePagoDto extends PartialType(CreatePlanesDePagoDto) {}

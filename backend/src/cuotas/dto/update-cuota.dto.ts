import { PartialType } from '@nestjs/mapped-types';
import { CreateCuotaDto } from './create-cuota.dto.js';

export class UpdateCuotaDto extends PartialType(CreateCuotaDto) {}

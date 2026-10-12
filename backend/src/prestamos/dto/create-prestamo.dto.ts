import { IsEmail, IsNotEmpty, IsString, MaxLength, IsNumber, IsOptional, Min, Max, IsNumberString } from "class-validator";

export class CreatePrestamoDto {
    @IsNotEmpty()
    @IsNumber()
    montoPrestado: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(100)
    porcentajeRecargo: number;

    

}

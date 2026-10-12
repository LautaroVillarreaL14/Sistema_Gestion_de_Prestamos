import { IsEmail, IsNotEmpty, IsString, MaxLength, IsOptional, IsNumberString, Matches } from "class-validator";
export class CreateClienteDto {
    @IsString({message: "El nombre debe ser texto"})
    @IsNotEmpty({message: "El nombre no puede estar vacio"})
    @MaxLength(50,{message: "El nombre no puede superar los 50 caracteres"})
    nombre: string;

    @IsString({message: "El apellido debe ser texto"})
    @IsNotEmpty({message: "El apellido no puede estar vacio"})
    @MaxLength(50,{message: "El apellido no puede superar los 50 caracteres"})
    apellido: string;

    @IsNumberString()
    @IsNotEmpty({message: "El DNI no puede estar vacio"})
    @MaxLength(10, { message: "El DNI no puede superar los 10 caracteres" })
    @Matches(/^\d+$/, { message: 'El DNI debe contener solo numeros' })
    numeroDNI: string;

    @IsOptional()
    @IsEmail()
    @IsString({message: "El email debe ser texto"})
    @MaxLength(50,{message: "El email no puede superar los 50 caracteres"})
    email?: string | undefined;

}

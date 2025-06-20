import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength, IsPositive, IsArray, IsInt, ArrayNotEmpty, ArrayMinSize, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Asegúrate de importar ApiProperty
export class LoginDto {

    @ApiProperty({
        description: 'El correo electrónico del usuario',
    })
    @IsString()
    @IsNotEmpty()
    email: string;
    @ApiProperty({
            description: 'La contraseña del usuario',
    })
        @IsString()
        @IsNotEmpty()
        @MaxLength(30) // Ajusta el tamaño máximo según tus necesidades
        @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
        message: 'La contraseña debe contener al menos una letra, un número y un carácter especial.',
        })
  password: string;
}
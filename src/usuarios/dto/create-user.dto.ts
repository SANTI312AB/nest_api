import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength, IsPositive, IsArray, IsInt, ArrayNotEmpty, ArrayMinSize, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Asegúrate de importar ApiProperty

export class CreateUserDto {
  @ApiProperty({
    description: 'El nombre de usuario del nuevo usuario',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @ApiProperty({
    description: 'El correo electrónico del nuevo usuario',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description:
      'La contraseña del nuevo usuario. Debe contener letras, números y caracteres especiales.',
    example: 'securePassword123!',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30) // Ajusta el tamaño máximo según tus necesidades
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'La contraseña debe contener al menos una letra, un número y un carácter especial.',
  })
  password: string;
}
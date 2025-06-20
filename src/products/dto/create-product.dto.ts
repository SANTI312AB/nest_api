// src/products/dto/create-product.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength, IsPositive, IsArray, IsInt, ArrayNotEmpty, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Asegúrate de importar ApiProperty

export class CreateProductDto {
  @ApiProperty({ // <--- EJEMPLO PARA NAME
    description: 'El nombre del producto',
    example: 'Teclado Mecánico RGB',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ // <--- EJEMPLO PARA PRICE
    description: 'El precio del producto',
    example: 79.99,
    type: 'number',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ // <--- EJEMPLO PARA DESCRIPTION
    description: 'Descripción opcional del producto',
    example: 'Teclado con switches azules.',
    required: false, // Si es opcional en la creación también
  })
  @IsString()
  @IsOptional()
  description?: string;

   @ApiProperty({
    description: 'Array de IDs de las categorías a las que pertenece el producto.',
    example: [1, 2],
    type: [Number], // Indica a Swagger que es un array de números
    required: false
  })
  @IsArray()
  @IsInt({ each: true }) // Valida que cada elemento del array sea un entero
  @ArrayNotEmpty()      // Opcional: asegura que el array no esté vacío
  @ArrayMinSize(1)      // Opcional: asegura que haya al menos una categoría
  @IsOptional()         // Hazlo opcional si un producto puede no tener categorías al crearse
  categoryIds?: number[]; // Esperamos un array de IDs de categorías
}
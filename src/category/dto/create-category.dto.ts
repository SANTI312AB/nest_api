// src/products/dto/create-product.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength, IsPositive, IsArray, IsInt, ArrayNotEmpty, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Asegúrate de importar ApiProperty
export class CreateCategoryDto {

    @ApiProperty({
        description: 'El nombre de la categoría',
        example: 'Electrónica',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;
    
    @ApiProperty({
        description: 'Descripción opcional de la categoría',
        example: 'Categoría para productos electrónicos.',
        required: false, // Si es opcional en la creación también
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
    description: 'Array de IDs de los productos a las que pertenece una categoria.',
    example: [1, 2],
    type: [Number], // Indica a Swagger que es un array de números
    required: false
    })
    @IsArray()
    @IsInt({ each: true }) // Valida que cada elemento del array sea un entero
    @ArrayNotEmpty()      // Opcional: asegura que el array no esté vacío
    @ArrayMinSize(1)      // Opcional: asegura que haya al menos una categoría
    @IsOptional()    
    productId?:number[];


}
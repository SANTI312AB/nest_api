import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength, IsPositive, IsArray, IsInt, ArrayNotEmpty, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Asegúrate de importar ApiProperty

export class CreateFavoriteDto {
    @ApiProperty({
        description: 'ID del producto que se marca como favorito',
        example: '67890',
    })
    @IsNumber()
    @IsNotEmpty()
    productId: number;
}
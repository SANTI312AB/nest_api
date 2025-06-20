// src/products/dto/update-product.dto.ts
import { PartialType } from '@nestjs/swagger'; // Cambia la importación
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
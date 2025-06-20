import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody,
} from '@nestjs/swagger'; // <---

@ApiTags('products')
@Controller('products') // url de controlador
export class ProductsController {
   constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'El producto ha sido creado exitosamente.', type: CreateProductDto }) // Asume que devuelves el producto creado
  @ApiResponse({ status: 400, description: 'Entrada inválida.' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de todos los productos.', type: [CreateProductDto] }) // Indica que devuelve un array de productos
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  @ApiParam({ name: 'id', description: 'El ID del producto', type: Number })
  @ApiResponse({ status: 200, description: 'El producto encontrado.', type: CreateProductDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiParam({ name: 'id', description: 'El ID del producto a actualizar', type: Number })
  @ApiResponse({ status: 200, description: 'El producto ha sido actualizado exitosamente.', type: CreateProductDto }) // O el DTO que devuelvas
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiResponse({ status: 400, description: 'Entrada inválida.' }) // Es bueno tenerlo si usas DTOs
  @ApiBody({ type: UpdateProductDto }) // <--- ¡ESTE ES CRUCIAL! Asegúrate de que esté aquí.
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto, // El DTO se usa aquí
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'El ID del producto a eliminar', type: Number })
  @ApiResponse({ status: 200, description: 'El producto ha sido eliminado exitosamente.'}) // O 204 si no devuelves contenido
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}

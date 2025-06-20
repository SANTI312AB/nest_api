import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
    ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody,
} from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @ApiOperation({ summary: 'Crear una nueva categoría' })
    @ApiResponse({
        status: 201,
        description: 'La categoría ha sido creada exitosamente.',
        type: CreateCategoryDto,
    }) // Asume que devuelves la categoría creada
    @ApiResponse({ status: 400, description: 'Entrada inválida.' })
    @ApiBody({ type: CreateCategoryDto }) // Asume que el cuerpo es un string, ajusta según tu DTO
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las categorías' })
    @ApiResponse({
        status: 200,
        description: 'Lista de todas las categorías.',
        type: [CreateCategoryDto],
    }) // Indica que devuelve un array de categorías
    findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una categoría por su ID' })
    @ApiParam({ name: 'id', description: 'El ID de la categoría', type: Number })
    @ApiResponse({
        status: 200,
        description: 'La categoría encontrada.',
        type: CreateCategoryDto,
    })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
    @ApiResponse({ status: 400, description: 'Entrada inválida.' }) // Es bueno tenerlo si usas DTOs
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una categoría existente' })
    @ApiParam({
        name: 'id',
        description: 'El ID de la categoría a actualizar',
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: 'La categoría ha sido actualizada exitosamente.',
        type: UpdateCategoryDto,
    }) // O el DTO que devuelvas
    @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
    @ApiResponse({ status: 400, description: 'Entrada inválida.' }) // Es bueno tenerlo si usas DTOs
    @ApiBody({ type: UpdateCategoryDto }) // Asegúrate de que esté aquí
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: CreateCategoryDto, // El DTO se usa aquí
    ) {
        return this.categoryService.update(id, updateCategoryDto);
    }


    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una categoría' })
    @ApiParam({ name: 'id', description: 'El ID de la categoría a eliminar', type: Number })
    @ApiResponse({ status: 200, description: 'La categoría ha sido eliminada exitosamente.' }) // O 204 si no devuelves contenido
    @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.remove(id);
    }
}

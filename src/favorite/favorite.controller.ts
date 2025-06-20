import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody,
} from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('favorite')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard) // Protección JWT
@Controller('favorite')
export class FavoriteController {

    constructor(private readonly favoriteService: FavoriteService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los favoritos de un usuario' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async findAll(@CurrentUser() user: any ) {
        return this.favoriteService.findAll(user.sub);
    }

    
    @Post()
    @ApiOperation({ summary: 'Agregar un producto a favoritos' })// Asume que devuelves el favorito creado
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async create(
        @CurrentUser() user: any,
        @Body() createFavoriteDto: CreateFavoriteDto
    ) {
        return this.favoriteService.create(user.sub, createFavoriteDto);
    }


    @Delete(':productId')
    @ApiOperation({ summary: 'Eliminar un producto de favoritos' })
    @ApiParam({ name: 'productId', description: 'El ID del producto a eliminar', type: Number })
    @ApiResponse({
        status: 200,
        description: 'El favorito ha sido eliminado exitosamente.',
    })
    @ApiResponse({ status: 404, description: 'Favorito no encontrado.' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async remove(
        @CurrentUser() user: any,
        @Param('productId', ParseIntPipe) id: number
    ) {
        return this.favoriteService.remove(user.sub, id);
    }
}

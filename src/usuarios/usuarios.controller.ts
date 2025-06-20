import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'El usuario ha sido creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Entrada inválida.' })
    @ApiBody({ type: CreateUserDto })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usuariosService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de todos los usuarios.' })
    findAll() {
        return this.usuariosService.findAll();
    }


    @Patch()
    @ApiOperation({ summary: 'Actualizar mi usuario' })
    @ApiResponse({ status: 200, description: 'El usuario ha sido actualizado exitosamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard) // Protección JWT
    @ApiBody({ type: UpdateUserDto })
    update(
        @CurrentUser() user: any,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usuariosService.update(user.sub, updateUserDto);
    }

    @Delete()
    @ApiOperation({ summary: 'Eliminar mi usuario' })
    @ApiResponse({ status: 200, description: 'El usuario ha sido eliminado exitosamente.' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usuariosService.remove(id);
    }
}

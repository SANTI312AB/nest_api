import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(private prisma: PrismaService){}
    

    async findAll() : Promise<any[]> {
        const users = await this.prisma.user.findMany({
        });

        return users;
    }

    async findOne(id: number): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new Error(`Usuario con ID ${id} no encontrado`);
        }

        return user;
    }


    async findByEmail(email: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: 
            { 
                email
            },
        });
        if (!user) {
            throw new NotFoundException(`Usuario con email ${email} no encontrado`);
        }

        if (!user.isActive) {
            throw new BadRequestException(`El usuario con email ${email} no está activo`);
        }
        
        return user;
    }


    async create(createUserDto: CreateUserDto): Promise<{ message: string; user: any }> {
        // Validar que el email sea único
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingEmail) {
            throw new BadRequestException(`El email ${createUserDto.email} ya está en uso`);
        }

        // Validar que el username sea único
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: createUserDto.username },
        });
        if (existingUsername) {
            throw new BadRequestException(`El username ${createUserDto.username} ya está en uso`);
        }

        // Encriptar la contraseña antes de guardar el usuario
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const { password, ...rest } = createUserDto;

        const user = await this.prisma.user.create({
            data: {
                ...rest,
                password: hashedPassword,
            },
        });

        const { password: _removed, ...userWithoutPassword } = user; // Excluir la contraseña del objeto de respuesta

        return {
            message: 'Usuario creado correctamente',
            user: userWithoutPassword
        };
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<{ message: string; user: any }> {
        
      
        const existingUser = await this.prisma.user.findUnique({        
            where: { id }
        });
        
        if (!existingUser) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        // Validar que el email sea único si se proporciona y es diferente al actual
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const emailExists = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (emailExists) {
                throw new BadRequestException(`El email ${updateUserDto.email} ya está en uso`);
            }
        }

        // Validar que el username sea único si se proporciona y es diferente al actual
        if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
            const usernameExists = await this.prisma.user.findUnique({
                where: { username: updateUserDto.username },
            });
            if (usernameExists) {
                throw new BadRequestException(`El username ${updateUserDto.username} ya está en uso`);
            }
        }

        let data = { ...updateUserDto };

        // Si se proporciona una nueva contraseña, encriptarla
        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const { password, ...rest } = updateUserDto;

        const user = await this.prisma.user.update({
            where: {  id },
            data: {
                ...rest,
                password: data.password ? data.password : existingUser.password, // Mantener la contraseña existente si no se proporciona una nueva
            }
        });

        const { password: _removed, ...userWithoutPassword } = user; // Excluir la contraseña del objeto de respuesta

        return {
            message: 'Usuario actualizado correctamente',
            user: userWithoutPassword
        };
    }


    async remove(id: number): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: 'Usuario eliminado correctamente' };
    }


}

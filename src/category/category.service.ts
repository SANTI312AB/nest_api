import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
   constructor(private prisma: PrismaService){}

async create(createCategoryDto: CreateCategoryDto): Promise<{ message: string; category: any }> {
    const { productId, ...categoryData } = createCategoryDto;

    // Validar que los productIds existen antes de conectar
    if (productId && productId.length > 0) {
        const productsExist = await this.prisma.product.count({
            where: { id: { in: productId } },
        });
        if (productsExist !== productId.length) {
            throw new BadRequestException('Uno o más productos no son válidos.');
        }
    }

    const category = await this.prisma.category.create({
        data: {
            ...categoryData,
            productos: productId && productId.length > 0
                ? {
                    create: productId.map((prodId) => ({
                        product: {
                            connect: { id: prodId },
                        },
                    })),
                }
                : undefined,
        },
        include: {
            productos: {
                include: {
                    product: true,
                },
            },
        },
    });

    // Transformar la categoría para que 'products' sea un array de productos
    const transformedCategory = {
        ...category,
        productos: category.productos ?.map(cp => cp.product) || [],
    };

    return {
        message: 'Categoría guardada correctamente.',
        category: transformedCategory,
    };
}

    async findAll(): Promise<any[]> {
        const categoriesFromPrisma = await this.prisma.category.findMany({
            include: {
                productos: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Mantener 'productos' y corregir agrupación de productos
        return categoriesFromPrisma.map(category => ({
            ...category,

            productos: category.productos ?.map(cp => cp.product) || [], // Aseguramos que 'products' sea un array de productos
        }));
    }

    async findOne(id: number): Promise<any> {
        const categoryFromPrisma = await this.prisma.category.findUnique({
            where: { id },
            include: {
                productos: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!categoryFromPrisma) {
            throw new NotFoundException(`Categoría con ID ${id} no existe.`);
        }
        // Mantener 'productos' y corregir agrupación de productos
        return {
            ...categoryFromPrisma,
            productos: categoryFromPrisma.productos?.map(cp => cp.product) || [], // Aseguramos que 'products' sea un array de productos
        };
    }

    async update(id: number, updateCategoryDto: CreateCategoryDto): Promise<{ message: string; category: any }> {
        const { productId, ...categoryData } = updateCategoryDto;

        // Validar que los productIds existen antes de conectar
        if (productId && productId.length > 0) {
            const productsExist = await this.prisma.product.count({
                where: { id: { in: productId } },
            });
            if (productsExist !== productId.length) {
                throw new BadRequestException('Uno o más productos no son válidos.');
            }
        }

        try {
            // Actualizar la categoría y sus productos relacionados
            const category = await this.prisma.category.update({
                where: { id },
                data: {
                    ...categoryData,
                    productos: productId
                        ? {
                            deleteMany: {}, // Elimina todas las relaciones actuales
                            create: productId.map((prodId) => ({
                                product: {
                                    connect: { id: prodId },
                                },
                            })),
                        }
                        : undefined,
                },
                include: {
                    productos: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            // Transformar la categoría para que 'products' sea un array de productos
            const transformedCategory = {
                ...category,
                productos: category.productos?.map(cp => cp.product) || [],
            };

            return {
                message: 'Categoría actualizada correctamente.',
                category: transformedCategory,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Category con id  ${id} no existe.`);
            }
            throw error;
        }
    }

    async remove(id: number): Promise<Category> {
        try {
            return await this.prisma.category.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Category con ID ${id} no existe.`);
            }
            throw error;
        }
    }
     
     
}

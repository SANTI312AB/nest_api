import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {

    constructor(private prisma: PrismaService) {}

    async findAll(userId: number): Promise<any> {
        const favorites = await this.prisma.favorite.findMany({
            where: { userId },
            include: {
                product: true,
            },
        });

        return {
            productos: favorites.map(fav => fav.product)
        };
    }

    async create(userId: number, createFavoriteDto: CreateFavoriteDto): Promise<any> {
        const { productId } = createFavoriteDto;

        // Verificar si el producto existe
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
           
                 throw new NotFoundException('Producto no encontrado.');
            
        }

        // Verificar si el producto ya está en favoritos
        const existingFavorite = await this.prisma.favorite.findFirst({
            where: { userId, productId },
            include: { product: true },
        });

        if (existingFavorite) {
            throw new  BadRequestException('El producto ya está en favoritos.');
        }

        const favorite = await this.prisma.favorite.create({
            data: {
                userId,
                productId,
            }, 
            include: {
                product: true,
            },
        });

        return {
            message: 'Producto añadido a favoritos correctamente.',
            producto: favorite.product,
        };
    }

    async remove(userId: number, productId: number): Promise<{ message: string }> {
        const favorite = await this.prisma.favorite.findFirst({
            where: { userId, productId },
        });

        if (!favorite) {
            throw new NotFoundException('Favorito no encontrado.');
        }

        await this.prisma.favorite.delete({
            where: { userId_productId: { userId: favorite.userId, productId: favorite.productId } },
        });

        return { message: 'Producto eliminado de favoritos correctamente.' };
    }
         
}

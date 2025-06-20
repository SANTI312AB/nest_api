import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<{ message: string; product: any }> {
    const { categoryIds, ...productData } = createProductDto;

    // Opcional: Validar que las categoryIds existen antes de intentar conectar
    if (categoryIds && categoryIds.length > 0) {
      const categoriesExist = await this.prisma.category.count({
        where: { id: { in: categoryIds } },
      });
      if (categoriesExist !== categoryIds.length) {
        throw new BadRequestException('Una o más categorías no son válidas.');
      }
    }

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        categorias: categoryIds && categoryIds.length > 0
          ? {
              create: categoryIds.map((catId) => ({
                category: {
                  connect: { id: catId },
                },
              })),
            }
          : undefined,
      },
      include: {
        categorias: {
          include: {
            category: true,
          },
        },
      },
    });

    // Transformar el producto para que 'categorias' sea un array de categorías
    const transformedProduct = {
      ...product,
      categorias: product.categorias?.map(pc => pc.category) || [],
    };

    return {
      message: 'Producto guardado correctamente.',
      product: transformedProduct,
    };
  }

  async findAll(): Promise<any[]> { // Usamos any[] para la máxima simplicidad en la firma
    const productsFromPrisma = await this.prisma.product.findMany({
      include: {
        categorias: { // El campo de relación en tu modelo Product (ProductCategory[])
          include: {
            category: true, // Para tener los datos de la categoría anidados
          },
        },
      },
    });

    // Transformación directa y concisa
    return productsFromPrisma.map(product => ({
      ...product, // Copia todas las propiedades originales del producto
      // Sobrescribe 'categorias' con un array de solo los objetos 'category'
      // Usamos optional chaining (?.) y el operador OR (||) para manejar casos donde 'categorias' no exista o esté vacío.
      categorias: product.categorias?.map(pc => pc.category) || [],
    }));
  }

  async findOne(id: number): Promise<any> {
    const productFromPrisma = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categorias: {
          include: {
            category: true, // Incluye la información de la categoría asociada
          },
        },
      },
    });
    if (!productFromPrisma) {
      throw new NotFoundException(`Producto con ID ${id} no existe.`);
    }
    // Transformar el producto individualmente
    return {
      ...productFromPrisma,
      categorias: productFromPrisma.categorias?.map(pc => pc.category) || [],
    };
  }


  async update(id: number, updateProductDto: UpdateProductDto): Promise<{ message: string; product: any }> {
    const { categoryIds, ...productData } = updateProductDto;

    // Opcional: Validar que las categoryIds existen si se proporcionan
    if (categoryIds && categoryIds.length > 0) {
      const categoriesExist = await this.prisma.category.count({
        where: { id: { in: categoryIds } },
      });
      if (categoriesExist !== categoryIds.length) {
        throw new BadRequestException('Una o más IDs de categoría no son válidas.');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        categorias: categoryIds
          ? {
              deleteMany: {},
              create: categoryIds.map((catId) => ({
                category: {
                  connect: { id: catId },
                },
              })),
            }
          : productData.hasOwnProperty('categoryIds') && categoryIds === null
            ? { deleteMany: {} }
            : undefined,
      },
      include: {
        categorias: {
          include: {
            category: true,
          },
        },
      },
    });

    const transformedProduct = {
      ...updatedProduct,
      categorias: updatedProduct.categorias?.map(pc => pc.category) || [],
    };

    return {
      message: 'Producto actualizado correctamente.',
      product: transformedProduct,
    };
  }

  async remove(id: number): Promise<Product> {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product con ID ${id} no existe.`);
      }
      throw error;
    }
  }


}

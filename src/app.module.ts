import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { UsuariosService } from './usuarios/usuarios.service';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    forwardRef(() => AuthModule), // ← aquí
   ConfigModule.forRoot(
    {
      isGlobal: true, // Make the configuration available globally
      envFilePath: '.env', // Specify the path to your .env file
    }
   ),

   ProductsModule, PrismaModule, CategoryModule, UsuariosModule, AuthModule, FavoriteModule
  ],
  controllers: [AppController, UsuariosController],
  providers: [AppService, UsuariosService],
})
export class AppModule {}

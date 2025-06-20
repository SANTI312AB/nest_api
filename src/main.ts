// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // <--- Importa Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de ValidationPipe (como ya lo tenías)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // --- Configuración de Swagger ---
  const config = new DocumentBuilder()
    .setTitle('Mi API Nest') // Título de tu API
    .setDescription('Documentación de la Api Nest.js') // Descripción
    .setVersion('1.0') // Versión de tu API
    .addTag('products', 'Operaciones relacionadas con productos') // Agrega un tag para agrupar endpoints
    .addTag('category', 'Operaciones relacionadas con categorías') // Agrega un tag para agrupar endpoints
     .addBearerAuth( // 👈 ESTA LÍNEA HABILITA EL TOKEN EN SWAGGER UI
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access-token', // 👈 Este nombre lo debes usar también en @ApiBearerAuth('access-token')
  )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // 'api-docs' será la ruta para acceder a la UI de Swagger
  // Por ejemplo: http://localhost:3000/api-docs
  // --- Fin de Configuración de Swagger ---


  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api-docs`); // Mensaje útil
}

bootstrap();
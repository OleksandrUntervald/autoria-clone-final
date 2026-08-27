import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // 🌟 Імпортуємо Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // 🌟 НАЛАШТУВАННЯ SWAGGER
  const config = new DocumentBuilder()
      .setTitle('Auto.ria Clone API') // Заголовок
      .setDescription('Документація для нашого маркетплейсу авто') // Опис
      .setVersion('1.0') // Версія
      .addBearerAuth() // 🔑 Це дуже важливо! Дозволить вводити JWT токен прямо в браузері
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // 🌐 URL, за яким буде доступна дока
  // 🌟 КІНЕЦЬ НАЛАШТУВАНЬ SWAGGER

  await app.listen(3000);
}
bootstrap();
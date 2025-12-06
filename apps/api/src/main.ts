import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  });

  // Add global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Solar Panel API')
    .setDescription('API documentation for Solar Panel Govt-scheme Installations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 8080);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 8080}`);
}
bootstrap();

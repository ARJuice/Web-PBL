import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || configService.get<number>('BACKEND_PORT') || 4000;
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';

  app.enableCors({
    origin: [corsOrigin, 'http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  logger.log(`🚀 MATCH@SAHRDAYA Backend running on: http://localhost:${port}/graphql`);
}

bootstrap();

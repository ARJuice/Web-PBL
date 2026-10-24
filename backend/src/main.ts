import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { SentryExceptionFilter } from './common/filters/sentry.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || configService.get<number>('BACKEND_PORT') || 4000;
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
  const sentryDsn = configService.get<string>('SENTRY_DSN');

  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment: configService.get<string>('NODE_ENV') || 'development',
      tracesSampleRate: 1.0,
    });
    logger.log('Sentry error tracking initialized successfully.');
  }

  app.useGlobalFilters(new SentryExceptionFilter());

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

  // Health check endpoint for Docker and Kubernetes probes
  app.getHttpAdapter().get('/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  await app.listen(port);
  logger.log(`🚀 MATCH@SAHRDAYA Backend running on: http://localhost:${port}/graphql`);
}

bootstrap();

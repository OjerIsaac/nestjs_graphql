import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app.module';
import { ValidationPipe } from './libs/pipes';
import { TransformInterceptor } from './libs/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Nest Application');

  const allowedOrigins = ['http://localhost:3000', 'http://[::1]:3000'];

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix('/api/v1');

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port || 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

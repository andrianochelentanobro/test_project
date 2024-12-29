import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvInterface } from 'assets/interface/env/env.interface';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';




async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', true);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  
  const configService = app.get(ConfigService<EnvInterface>);

  const port = configService.get('APP_PORT') || 55555;
  const host = configService.get('APP_HOST') || '127.0.0.1';

  await app.listen(port, host, () => {
    Logger.log(`Приложение запущено на http://${host}:${port}`);
  });
}

bootstrap();

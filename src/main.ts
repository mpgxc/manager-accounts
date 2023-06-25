import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(
    Number(process.env.APP_PORT) || 3001,
    process.env.APP_HOST || '0.0.0.0',
  );

  console.log(`Server running 🚀: ${await app.getUrl()}`);
})();

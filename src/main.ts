import { LoggerService } from '@infra/providers/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'node:path';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
    {
      rawBody: true,
      bufferLogs: true,
    },
  );

  const config = await app.resolve(ConfigService);
  const logger = await app.resolve(LoggerService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );

  app.useLogger(logger);
  app.setGlobalPrefix('api');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID!,
        brokers: [process.env.KAFKA_BROKER!],
        sasl: {
          mechanism: 'scram-sha-256',
          username: process.env.KAFKA_USERNAME!,
          password: process.env.KAFKA_PASSWORD!,
        },
        ssl: true,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'accounts',
      protoPath: path.join(__dirname, './infra/grpc/accounts.proto'),
      url: `${process.env.GRPC_HOST!}:${process.env.GRPC_PORT!}`,
    },
  });

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Uzze Accounts')
      .setDescription('The Uzze Accounts API description')
      .setVersion('1.0')
      .addTag('accounts')
      .build(),
  );

  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();

  await app.listen(
    config.getOrThrow('APP.APP_PORT'),
    config.getOrThrow('APP.APP_HOST'),
  );

  logger.debug(`Server running 🚀: ${await app.getUrl()}/api`);
})();

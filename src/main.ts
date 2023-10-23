import { GrpcClientOptionsService } from '@infra/grpc/grpc-clients.options';
import { kafkaClientConfigsService } from '@infra/messaging/kafka/kafka.configs';
import { LoggerService } from '@mpgxc/logger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { pino } from 'pino';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }),
    }),
    {
      rawBody: true,
      bufferLogs: true,
    },
  );

  const config = await app.resolve(ConfigService);
  const logger = await app.resolve(LoggerService);
  const options = await app.resolve(GrpcClientOptionsService);
  const kafkaConfigs = await app.resolve(kafkaClientConfigsService);

  app.setGlobalPrefix('api');
  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>(options.accountsOptions);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: kafkaConfigs.clientConfigs,
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

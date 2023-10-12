import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'node:path';
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
      protoPath: join(__dirname, './infra/grpc/accounts.proto'),
      url: `${process.env.GRPC_HOST!}:${process.env.GRPC_PORT!}`,
    },
  });

  app.setGlobalPrefix('api');

  await app.startAllMicroservices();

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Uzze Accounts')
      .setDescription('The Uzze Accounts API description')
      .setVersion('1.0')
      .addTag('accounts')
      .build(),
  );

  SwaggerModule.setup('docs', app, document);

  await app.listen(
    Number(process.env.APP_PORT) || 3001,
    process.env.APP_HOST || '0.0.0.0',
  );

  console.log(`Server running 🚀: ${await app.getUrl()}/api`);
})();

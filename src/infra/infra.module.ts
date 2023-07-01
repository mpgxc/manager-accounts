import { ApplicationErrorMapper } from '@commons/errors';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import * as path from 'node:path';
import { DatabaseModule } from './database/database.module';
import { configuration } from './environment';
import { InfraHttpModule } from './http/http.module';
import { MessagingModule } from './messaging/messaging.module';
import { ImplHasherProvider } from './providers/hasher';
import { LoggerService } from './providers/logger/logger.service';
import {
  ImplSecretsManagerProvider,
  SecretsManagerPackage,
} from './providers/secrets-manager';

const InfraContainerInject = [
  ImplSecretsManagerProvider,
  ApplicationErrorMapper,
  ImplHasherProvider,
  LoggerService,
];

@Global()
@Module({
  imports: [
    PassportModule,
    InfraHttpModule,
    {
      module: MessagingModule,
      global: true,
    },
    {
      module: DatabaseModule,
      global: true,
    },
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 24, // 1 day
    }),
    JwtModule.register({
      global: true,
      signOptions: {
        algorithm: 'RS256',
      },
    }),
    ClientsModule.register([
      {
        name: SecretsManagerPackage,
        transport: Transport.GRPC,
        options: {
          url: `${process.env.GRPC_HOST!}:${process.env.GRPC_PORT!}`,
          package: process.env.GRPC_PACKAGE!,
          protoPath: path.join(__dirname, './grpc/secrets-manager.proto'),
        },
      },
    ]),
  ],
  providers: InfraContainerInject,
  exports: InfraContainerInject,
})
export class InfraModule {}

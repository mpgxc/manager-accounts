import { ApplicationErrorMapper } from '@commons/errors';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { redisStore } from 'cache-manager-redis-yet';
import * as path from 'node:path';
import { type RedisClientOptions } from 'redis';
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
import { ImplTokensProvider } from './providers/tokens/tokens.provider';

const InfraContainerInject = [
  ImplSecretsManagerProvider,
  ApplicationErrorMapper,
  ImplTokensProvider,
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
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      url: process.env.REDIS_URL,
      store: redisStore,
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
          package: process.env.SM_GRPC_PACKAGE!,
          protoPath: path.join(__dirname, './grpc/secrets-manager.proto'),
        },
      },
    ]),
  ],
  providers: InfraContainerInject,
  exports: InfraContainerInject,
})
export class InfraModule {}

import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { ApplicationErrorMapper } from 'commons/errors';
import * as path from 'node:path';
import { DatabaseModule } from './database/database.module';
import { configuration } from './environment';
import { InfraHttpModule } from './http/http.module';
import { MessagingModule } from './messaging/messaging.module';
import { ImplHasherProvider } from './providers/hasher/hasher.provider';
import { LoggerService } from './providers/logger/logger.service';
import { SecretsManagerPackage } from './providers/secrets-manager/secrets-manager.interface';
import { ImplSecretsManagerProvider } from './providers/secrets-manager/secrets-manager.provider';

const InfraContainerInject = [
  ImplSecretsManagerProvider,
  ApplicationErrorMapper,
  ImplHasherProvider,
  LoggerService,
];

@Global()
@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    InfraHttpModule,
    MessagingModule,
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
        expiresIn: '15m',
        algorithm: 'RS256',
      },
    }),
    ClientsModule.register([
      //TODO: Adicionar ao environment
      {
        name: SecretsManagerPackage,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:5000',
          package: 'secrets',
          protoPath: path.join(__dirname, './grpc/secrets-manager.proto'),
        },
      },
    ]),
  ],
  providers: InfraContainerInject,
  exports: InfraContainerInject,
})
export class InfraModule {}

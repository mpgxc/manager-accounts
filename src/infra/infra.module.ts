import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { ApplicationErrorMapper } from 'commons/errors';
import * as path from 'node:path';
import { InfraHttpModule } from './http/http.module';
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
    PassportModule,
    InfraHttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
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
      {
        name: SecretsManagerPackage,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:5000', //TODO: Adicionar ao environment
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

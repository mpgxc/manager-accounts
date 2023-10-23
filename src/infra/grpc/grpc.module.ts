import {
  SecretsManagerPackage,
  SecretsManagerProviderImpl,
} from '@infra/providers/secrets-manager';
import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { SessionVerifyController } from './controllers/session-verify.controller';
import { GrpcClientOptionsService } from './grpc-clients.options';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SecretsManagerPackage,
        inject: [GrpcClientOptionsService],
        useFactory: (options: GrpcClientOptionsService) =>
          options.secretsManagerOptions,
      },
    ]),
  ],
  controllers: [SessionVerifyController],
  providers: [GrpcClientOptionsService, SecretsManagerProviderImpl],
  exports: [GrpcClientOptionsService, SecretsManagerProviderImpl],
})
export class InfraGRPCModule {}

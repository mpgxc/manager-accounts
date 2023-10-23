import {
  ImplSecretsManagerProvider,
  SecretsManagerPackage,
} from '@infra/providers/secrets-manager';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SessionVerifyController } from './controllers/session-verify.controller';
import { GrpcClientOptionsService } from './grpc-clients.options';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SecretsManagerPackage,
        inject: [GrpcClientOptionsService],
        useFactory: (options: GrpcClientOptionsService) => ({
          transport: Transport.GRPC,
          options: options.secretsManagerOptions,
        }),
      },
    ]),
  ],
  controllers: [SessionVerifyController],
  providers: [GrpcClientOptionsService, ImplSecretsManagerProvider],
  exports: [GrpcClientOptionsService, ImplSecretsManagerProvider],
})
export class InfraGRPCModule {}

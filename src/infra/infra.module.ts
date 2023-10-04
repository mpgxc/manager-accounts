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
      secretOrPrivateKey:
        '-----BEGIN RSA PRIVATE KEY----- MIICXAIBAAKBgFGSv/p5IYh1Q+1Z3BavF7L2DtRXr3SqxT+RBjgN4aFsJPKF45cb x9WFgOT2Og5SEx2FxdCS0VP84bbhlIF9mHZrhsW+kKne4EvTzKnu7a19ChLKxTrI /aqAxifW/HKm3ZUil2TCYIcApCjZdooiSAn60u4s312/+lX7HlZEJaElAgMBAAEC gYBK8f0X7vp0GOkTxJ+E59FqRs9RIE6/bbZTtLZ2AarvWCCKAaEcUBXFgybtNZwZ VCbj1OftvTY9Z/UoxRBf+Dh+aNvv6J8SAQl0SrGNbhY3Ad1X3XTBsUIKGSiKF4Z9 UJ7NlIv8PxjfVjZQ0uPiQz8i8TeF5Xd16ELmF9WCHEFycQJBAKKzb39AI5JE0QjS nij1/WGdoXEDOCfzilWdDBN1bebBbE3Ba+n1jJTJHH5XgAHX+B9ohQn9hkzzqFCZ Yps8iasCQQCAWbyS0jj8pQx4eFG9aivqJ3CSy5auBEczvNkHmi5v9R67dJJviJfj m+PS+wgfpkcEpWkHrtMUbpzRZegSIdBvAkEAoF6pqg44gbZfLIkd6FX/uTY8qT55 HbgKRLUV8CAxgeBptoLOsb+dIBLTiR0KScbtBVhquhwxQqxw3XEzJryXHQJAIMtM 5FK0XtEpC4rqj7QV/mEPYWKFYHcVXkHNTiT14oNF0+2oELlc3boSDvE3FSceFDDT UjQ4GItepB4emqtrHwJBAJN9wLMbRTIittZZ4ldsfcALbRFpv9zEUwL75ZBrZVIN H6t4CAYGu3vk7batCHo2hGNmJA/vrkOsxZCopZ/lOJ0= -----END RSA PRIVATE KEY-----',
      secret:
        '-----BEGIN RSA PRIVATE KEY----- MIICXAIBAAKBgFGSv/p5IYh1Q+1Z3BavF7L2DtRXr3SqxT+RBjgN4aFsJPKF45cb x9WFgOT2Og5SEx2FxdCS0VP84bbhlIF9mHZrhsW+kKne4EvTzKnu7a19ChLKxTrI /aqAxifW/HKm3ZUil2TCYIcApCjZdooiSAn60u4s312/+lX7HlZEJaElAgMBAAEC gYBK8f0X7vp0GOkTxJ+E59FqRs9RIE6/bbZTtLZ2AarvWCCKAaEcUBXFgybtNZwZ VCbj1OftvTY9Z/UoxRBf+Dh+aNvv6J8SAQl0SrGNbhY3Ad1X3XTBsUIKGSiKF4Z9 UJ7NlIv8PxjfVjZQ0uPiQz8i8TeF5Xd16ELmF9WCHEFycQJBAKKzb39AI5JE0QjS nij1/WGdoXEDOCfzilWdDBN1bebBbE3Ba+n1jJTJHH5XgAHX+B9ohQn9hkzzqFCZ Yps8iasCQQCAWbyS0jj8pQx4eFG9aivqJ3CSy5auBEczvNkHmi5v9R67dJJviJfj m+PS+wgfpkcEpWkHrtMUbpzRZegSIdBvAkEAoF6pqg44gbZfLIkd6FX/uTY8qT55 HbgKRLUV8CAxgeBptoLOsb+dIBLTiR0KScbtBVhquhwxQqxw3XEzJryXHQJAIMtM 5FK0XtEpC4rqj7QV/mEPYWKFYHcVXkHNTiT14oNF0+2oELlc3boSDvE3FSceFDDT UjQ4GItepB4emqtrHwJBAJN9wLMbRTIittZZ4ldsfcALbRFpv9zEUwL75ZBrZVIN H6t4CAYGu3vk7batCHo2hGNmJA/vrkOsxZCopZ/lOJ0= -----END RSA PRIVATE KEY-----',
      signOptions: {
        algorithm: 'RS256',
      },
    }),
    ClientsModule.register([
      {
        name: SecretsManagerPackage,
        transport: Transport.GRPC,
        options: {
          url: `${process.env.SM_GRPC_HOST!}:${process.env.SM_GRPC_PORT!}`,
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

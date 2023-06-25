import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ApplicationErrorMapper } from 'commons/errors';
import { InfraHttpModule } from './http/http.module';
import { LoggerService } from './providers/logger/logger.service';

const InfraContainerInject = [ApplicationErrorMapper, LoggerService];

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InfraHttpModule,
  ],
  providers: InfraContainerInject,
  exports: InfraContainerInject,
})
export class InfraModule {}

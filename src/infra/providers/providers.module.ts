import { Global, Module } from '@nestjs/common';
import { ImplHasherProvider } from './hasher';
import { LoggerService } from './logger/logger.service';
import { ImplMailingProvider } from './mailing';
import { ImplTokensProvider } from './tokens';

const ProvidersContainerInject = [
  ImplMailingProvider,
  ImplTokensProvider,
  ImplHasherProvider,
  LoggerService,
];

@Global()
@Module({
  providers: ProvidersContainerInject,
  exports: ProvidersContainerInject,
})
export class ProvidersModule {}

import { Global, Module } from '@nestjs/common';
import { ImplHasherProvider } from './hasher';
import { ImplMailingProvider } from './mailing';
import { ImplTokensProvider } from './tokens';

const ProvidersContainerInject = [
  ImplMailingProvider,
  ImplTokensProvider,
  ImplHasherProvider,
];

@Global()
@Module({
  providers: ProvidersContainerInject,
  exports: ProvidersContainerInject,
})
export class ProvidersModule {}

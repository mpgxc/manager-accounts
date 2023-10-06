import { Module } from '@nestjs/common';

import { TenantMapper } from './mappers/tenant-mapper';
import { ImplAccountRepository } from './repositories';
import { ImplTenantRepository } from './repositories/tenant-repository';
import { ImplTokenRepository } from './repositories/token-repository';
import { PrismaService } from './services/prisma.service';

export const DatabaseContainerInject = Object.freeze({
  AccountRepository: {
    provide: ImplAccountRepository.name,
    useClass: ImplAccountRepository,
  },

  TenantRepository: {
    provide: ImplTenantRepository.name,
    useClass: ImplTenantRepository,
  },

  TokenRepository: {
    provide: ImplTokenRepository.name,
    useClass: ImplTokenRepository,
  },
});

@Module({
  imports: [],
  providers: [
    TenantMapper,
    PrismaService,
    DatabaseContainerInject.AccountRepository,
    DatabaseContainerInject.TenantRepository,
    DatabaseContainerInject.TokenRepository,
  ],
  exports: [
    PrismaService,
    DatabaseContainerInject.AccountRepository,
    DatabaseContainerInject.TenantRepository,
    DatabaseContainerInject.TokenRepository,
  ],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';

import { ImplAccountRepository } from './repositories';
import { ImplTenantRepository } from './repositories/tenant-repository';
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
});

@Module({
  imports: [],
  providers: [
    PrismaService,
    DatabaseContainerInject.AccountRepository,
    DatabaseContainerInject.TenantRepository,
  ],
  exports: [
    PrismaService,
    DatabaseContainerInject.AccountRepository,
    DatabaseContainerInject.TenantRepository,
  ],
})
export class DatabaseModule {}

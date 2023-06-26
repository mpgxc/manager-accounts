import { Module } from '@nestjs/common';

import { ImplAccountRepository } from './repositories';
import { PrismaService } from './services/prisma.service';

export const DatabaseContainerInject = Object.freeze({
  AccountRepository: {
    provide: ImplAccountRepository.name,
    useClass: ImplAccountRepository,
  },
});

@Module({
  imports: [],
  providers: [PrismaService, DatabaseContainerInject.AccountRepository],
  exports: [PrismaService, DatabaseContainerInject.AccountRepository],
})
export class DatabaseModule {}

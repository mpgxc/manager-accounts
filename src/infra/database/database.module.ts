import { Module } from '@nestjs/common';

import { PrismaService } from './services/prisma.service';

export const DatabaseContainerInject = Object.freeze({});

@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}

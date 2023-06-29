import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { ApplicationModule } from 'application/application.module';
import { PermissionsGuard } from './auth/permissions.guard';
import { RolesGuard } from './auth/roles.guard';
import { TokenGuard } from './auth/token.guard';
import { TokenStrategy } from './auth/token.strategy';
import { TenantMiddleware } from './commons/tenant.middleware';
import { AccountsController } from './controllers/account.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AccountsController],
  providers: [
    TokenStrategy,
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class InfraHttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}

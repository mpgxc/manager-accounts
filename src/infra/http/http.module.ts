import { ApplicationModule } from '@application/application.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard, RolesGuard, TokenStrategy } from './auth';
import { RefreshTokenStrategy } from './auth/refresh-token.strategy';
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
    consumer
      .apply(TenantMiddleware)
      .exclude({
        method: RequestMethod.ALL,
        path: 'accounts/me(.*)',
      })
      .forRoutes(AccountsController);
  }
}

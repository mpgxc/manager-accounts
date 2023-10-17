import { ApplicationModule } from '@application/application.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  PermissionsGuard,
  RefreshTokenStrategy,
  RolesGuard,
  TokenStrategy,
} from './auth';
import { TenantMiddleware } from './commons/tenant.middleware';
import { AccountsProfileController } from './controllers/account-profile.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { RefreshTokenController } from './controllers/refresh-token.controller';
import { RegisterAccountController } from './controllers/register-account.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [
    RegisterAccountController,
    AccountsProfileController,
    AuthenticateController,
    RefreshTokenController,
  ],
  providers: [
    TokenStrategy,
    RefreshTokenStrategy,
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
      .forRoutes(AccountsProfileController, RefreshTokenController);
  }
}

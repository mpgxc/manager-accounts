import { Module } from '@nestjs/common';
import { ImplRegisterAccountCommand } from './commands/register-account';
import { ImplRegisterTenantCommand } from './commands/register-tenant';
import { ImplAuthenticateAccountQuery } from './queries/authenticate-account';
import { ImplGetAccountQuery } from './queries/get-account';
import { ImplRefreshTokenQuery } from './queries/refresh-token';

export const ApplicationContainerInject = Object.freeze({
  RegisterAccountCommand: {
    useClass: ImplRegisterAccountCommand,
    provide: ImplRegisterAccountCommand.name,
  },

  AuthenticateAccountCommand: {
    useClass: ImplAuthenticateAccountQuery,
    provide: ImplAuthenticateAccountQuery.name,
  },

  GetAccountQuery: {
    useClass: ImplGetAccountQuery,
    provide: ImplGetAccountQuery.name,
  },

  RegisterTenantCommand: {
    useClass: ImplRegisterTenantCommand,
    provide: ImplRegisterTenantCommand.name,
  },

  RefreshTokenQuery: {
    useClass: ImplRefreshTokenQuery,
    provide: ImplRefreshTokenQuery.name,
  },
});

@Module({
  providers: [
    ApplicationContainerInject.AuthenticateAccountCommand,
    ApplicationContainerInject.RegisterAccountCommand,
    ApplicationContainerInject.RegisterTenantCommand,
    ApplicationContainerInject.RefreshTokenQuery,
    ApplicationContainerInject.GetAccountQuery,
  ],
  exports: [
    ApplicationContainerInject.AuthenticateAccountCommand,
    ApplicationContainerInject.RegisterAccountCommand,
    ApplicationContainerInject.RegisterTenantCommand,
    ApplicationContainerInject.RefreshTokenQuery,
    ApplicationContainerInject.GetAccountQuery,
  ],
})
export class ApplicationModule {}

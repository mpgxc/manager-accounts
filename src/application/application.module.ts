import { Module } from '@nestjs/common';
import { ImplRegisterAccountCommand } from './commands/register-account';
import { ImplRegisterTenantCommand } from './commands/register-tenant';
import { ImplAuthenticateAccountCommand } from './queries/authenticate-account';
import { ImplGetAccountCommand } from './queries/get-account';

export const ApplicationContainerInject = Object.freeze({
  RegisterAccountCommand: {
    useClass: ImplRegisterAccountCommand,
    provide: ImplRegisterAccountCommand.name,
  },

  AuthenticateAccountCommand: {
    useClass: ImplAuthenticateAccountCommand,
    provide: ImplAuthenticateAccountCommand.name,
  },

  GetAccountCommand: {
    useClass: ImplGetAccountCommand,
    provide: ImplGetAccountCommand.name,
  },

  RegisterTenantCommand: {
    useClass: ImplRegisterTenantCommand,
    provide: ImplRegisterTenantCommand.name,
  },
});

@Module({
  providers: [
    ApplicationContainerInject.RegisterAccountCommand,
    ApplicationContainerInject.AuthenticateAccountCommand,
    ApplicationContainerInject.RegisterTenantCommand,
    ApplicationContainerInject.GetAccountCommand,
  ],
  exports: [
    ApplicationContainerInject.RegisterAccountCommand,
    ApplicationContainerInject.AuthenticateAccountCommand,
    ApplicationContainerInject.RegisterTenantCommand,
    ApplicationContainerInject.GetAccountCommand,
  ],
})
export class ApplicationModule {}

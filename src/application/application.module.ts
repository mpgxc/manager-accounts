import { Module } from '@nestjs/common';
import { DatabaseModule } from 'infra/database/database.module';
import { ImplRegisterAccountCommand } from './commands/register-account';
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
});

@Module({
  imports: [DatabaseModule],
  providers: [
    ApplicationContainerInject.RegisterAccountCommand,
    ApplicationContainerInject.AuthenticateAccountCommand,
    ApplicationContainerInject.GetAccountCommand,
  ],
  exports: [
    ApplicationContainerInject.RegisterAccountCommand,
    ApplicationContainerInject.AuthenticateAccountCommand,
    ApplicationContainerInject.GetAccountCommand,
  ],
})
export class ApplicationModule {}

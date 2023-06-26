import { Module } from '@nestjs/common';
import { DatabaseModule } from 'infra/database/database.module';
import { ImplRegisterAccountCommand } from './commands/register-account';
import { ImplAuthenticateAccountCommand } from './queries/authenticate-account';

export const ApplicationContainerInject = Object.freeze({
  RegisterAccountCommand: {
    useClass: ImplRegisterAccountCommand,
    provide: ImplRegisterAccountCommand.name,
  },

  AuthenticateAccountCommand: {
    useClass: ImplAuthenticateAccountCommand,
    provide: ImplAuthenticateAccountCommand.name,
  },
});

@Module({
  imports: [DatabaseModule],
  providers: [
    ApplicationContainerInject.RegisterAccountCommand,
    ApplicationContainerInject.AuthenticateAccountCommand,
  ],
  exports: [
    ApplicationContainerInject.RegisterAccountCommand,
    ApplicationContainerInject.AuthenticateAccountCommand,
  ],
})
export class ApplicationModule {}

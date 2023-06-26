import { Module } from '@nestjs/common';
import { DatabaseModule } from 'infra/database/database.module';
import { ImplRegisterAccountCommand } from './commands/register-account';

export const ApplicationContainerInject = Object.freeze({
  RegisterAccountCommand: {
    useClass: ImplRegisterAccountCommand,
    provide: ImplRegisterAccountCommand.name,
  },
});

@Module({
  imports: [DatabaseModule],
  providers: [ApplicationContainerInject.RegisterAccountCommand],
  exports: [ApplicationContainerInject.RegisterAccountCommand],
})
export class ApplicationModule {}

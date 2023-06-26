import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ImplRegisterAccountCommand } from 'application/commands/register-account';
import { ApplicationErrorMapper } from 'commons/errors';
import { RegisterAccountCommand } from 'domain/commands/register-account';
import { LoggerService } from 'infra/providers/logger/logger.service';
import { AccountInput } from '../inputs/account.input';

@Controller('accounts')
export class AccountsController {
  constructor(
    @Inject(ImplRegisterAccountCommand.name)
    private readonly registerAccountCommand: RegisterAccountCommand,
    private readonly errorMapper: ApplicationErrorMapper,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AccountsController.name);
  }

  @Post()
  async createAccount(@Body() body: AccountInput) {
    const { name, phone, email, lastName, password, username } = body;

    this.logger.log('Infra > Http > Account Controller > Create Account', {
      email,
      username,
    });

    const response = await this.registerAccountCommand.handle({
      name,
      phone,
      email,
      lastName,
      password,
      username,
    });

    if (response.hasError) {
      this.logger.warn(
        `Infra > Http > Account Controller > Create Account > Failure: ${response.value.message}`,
      );

      throw new this.errorMapper.toException[response.value.name](
        response.value.message,
      );
    }

    this.logger.log(
      'Infra > Http > Account Controller > Create Account > Success',
      {
        email,
        username,
      },
    );
  }
}

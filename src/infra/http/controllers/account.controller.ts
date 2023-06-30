import { ImplRegisterAccountCommand } from '@application/commands/register-account';
import { ImplAuthenticateAccountCommand } from '@application/queries/authenticate-account';
import { ImplGetAccountCommand } from '@application/queries/get-account';
import { ApplicationErrorMapper } from '@commons/errors';
import { RegisterAccountCommand } from '@domain/commands/register-account';
import { AuthenticateAccountCommand } from '@domain/queries/authenticate-account';
import { GetAccountCommand } from '@domain/queries/get-account';
import { RequesterUser } from '@global/express.d';
import { LoggerService } from '@infra/providers/logger/logger.service';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Permissions, Public } from '../auth';
import { CurrentUser, RequiredHeaders } from '../commons';
import {
  AccountInput,
  AuthenticateAccountInput,
} from '../inputs/account.input';

@Controller('accounts')
export class AccountsController {
  constructor(
    @Inject(ImplRegisterAccountCommand.name)
    private readonly registerAccountCommand: RegisterAccountCommand,

    @Inject(ImplAuthenticateAccountCommand.name)
    private readonly authenticateAccountCommand: AuthenticateAccountCommand,

    @Inject(ImplGetAccountCommand.name)
    private readonly getAccountCommand: GetAccountCommand,

    private readonly errorMapper: ApplicationErrorMapper,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AccountsController.name);
  }

  @Public()
  @Post()
  async createAccount(
    @RequiredHeaders(['x-tenant-id']) headers: Record<string, string>,
    @Body() body: AccountInput,
  ) {
    const { name, phone, email, lastName, password, username } = body;
    const tenantCode = headers['x-tenant-id'];

    this.logger.log('Infra > Http > Controller > Create Account', {
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
      tenantCode,
    });

    if (response.hasError) {
      this.logger.warn(
        `Infra > Http > Controller > Create Account > Failure: ${response.value.message}`,
      );

      throw new this.errorMapper.toException[response.value.name](
        response.value.message,
      );
    }

    this.logger.log('Infra > Http > Controller > Create Account > Success', {
      email,
      username,
    });
  }

  @Public()
  @Post('login')
  async authenticateAccount(
    @RequiredHeaders(['x-tenant-id']) headers: Record<string, string>,
    @Body() body: AuthenticateAccountInput,
  ) {
    const { email, password } = body;
    const tenantCode = headers['x-tenant-id'];

    this.logger.log('Infra > Http > Controller > Authenticate Account', {
      email,
    });

    const response = await this.authenticateAccountCommand.handle({
      email,
      password,
      tenantCode,
    });

    if (response.hasError) {
      this.logger.warn(
        `Infra > Http > Controller > Authenticate Account > Failure: ${response.value.message}`,
      );

      throw new this.errorMapper.toException[response.value.name](
        response.value.message,
      );
    }

    this.logger.log(
      'Infra > Http > Controller > Authenticate Account > Success',
      {
        email,
      },
    );

    return response.value;
  }

  @Permissions('accounts:read')
  @Get('me')
  async me(@CurrentUser() user: RequesterUser): Promise<RequesterUser> {
    return user;
  }
}

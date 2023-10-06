import { ImplRegisterAccountCommand } from '@application/commands/register-account';
import { ImplAuthenticateAccountQuery } from '@application/queries/authenticate-account';
import { ApplicationErrorMapper } from '@commons/errors';
import { RegisterAccountCommand } from '@domain/commands/register-account';
import { AuthenticateAccountQuery } from '@domain/queries/authenticate-account';
import { RefreshTokenQuery } from '@domain/queries/refresh-token';
import { UserRequester } from '@global/express';
import { LoggerService } from '@infra/providers/logger/logger.service';
import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard, TokenGuard } from '../auth';
import { CurrentUser, RequiredHeaders } from '../commons';
import { AccountInput, AuthenticateAccountInput } from '../inputs';

@Controller('accounts')
export class AccountsController {
  constructor(
    @Inject(ImplRegisterAccountCommand.name)
    private readonly registerAccountCommand: RegisterAccountCommand,

    @Inject(ImplAuthenticateAccountQuery.name)
    private readonly authenticateAccountQuery: AuthenticateAccountQuery,

    private readonly errorMapper: ApplicationErrorMapper,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AccountsController.name);
  }

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

    const response = await this.authenticateAccountQuery.handle({
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

  @UseGuards(TokenGuard)
  @Get('me')
  async me(@CurrentUser() user: UserRequester): Promise<UserRequester> {
    return user;
  }
}

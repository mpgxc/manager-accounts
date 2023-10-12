import { ImplRegisterAccountCommand } from '@application/commands/register-account';
import { ImplAuthenticateAccountQuery } from '@application/queries/authenticate-account';
import { ImplRefreshTokenQuery } from '@application/queries/refresh-token';
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
import { AuthenticateAccountInput, RegisterAccountInput } from '../inputs';
import { AuthenticateAccountOutput, MeOutput } from '../outputs/account.output';

@Controller('accounts')
export class AccountsController {
  constructor(
    @Inject(ImplRegisterAccountCommand.name)
    private readonly registerAccountCommand: RegisterAccountCommand,

    @Inject(ImplAuthenticateAccountQuery.name)
    private readonly authenticateAccountQuery: AuthenticateAccountQuery,

    @Inject(ImplRefreshTokenQuery.name)
    private readonly refreshTokenQuery: RefreshTokenQuery,

    private readonly errorMapper: ApplicationErrorMapper,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AccountsController.name);
  }

  @Post()
  async createAccount(
    @RequiredHeaders(['x-tenant-id']) headers: Record<string, string>,
    @Body() body: RegisterAccountInput,
  ): Promise<void> {
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
  ): Promise<AuthenticateAccountOutput> {
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

  @UseGuards(RefreshTokenGuard)
  @Patch('me/refresh-token')
  async reAuthenticateAccount(
    @RequiredHeaders(['Authorization']) headers: Record<string, string>,
  ): Promise<AuthenticateAccountOutput> {
    const response = await this.refreshTokenQuery.handle({
      refreshToken: headers['Authorization'],
    });

    if (response.hasError) {
      throw new this.errorMapper.toException[response.value.name](
        response.value.message,
      );
    }

    return response.value;
  }

  // @Permissions('accounts:read')
  @UseGuards(TokenGuard)
  @Get('me')
  async me(@CurrentUser() user: UserRequester): Promise<MeOutput> {
    return user;
  }
}

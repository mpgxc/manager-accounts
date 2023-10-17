import { ImplRegisterAccountCommand } from '@application/commands/register-account';
import { ImplAuthenticateAccountQuery } from '@application/queries/authenticate-account';
import { ImplRefreshTokenQuery } from '@application/queries/refresh-token';
import { ExceptionMapper } from '@commons/errors';
import { RegisterAccountCommand } from '@domain/commands/register-account';
import { AuthenticateAccountQuery } from '@domain/queries/authenticate-account';
import { RefreshTokenQuery } from '@domain/queries/refresh-token';
import { UserRequester } from '@global/fastify';
import { LoggerService } from '@infra/providers/logger/logger.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { RefreshTokenGuard, TokenGuard } from '../auth';
import { CurrentUser, RequiredHeaders } from '../commons';
import { AuthenticateAccountInput, RegisterAccountInput } from '../inputs';
import {
  AuthenticateAccountOutput,
  BadRequestOutput,
  MeOutput,
  NotAuthorizedOutput,
  NotFoundOutput,
} from '../outputs/account.output';
@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    @Inject(ImplRegisterAccountCommand.name)
    private readonly registerAccountCommand: RegisterAccountCommand,

    @Inject(ImplAuthenticateAccountQuery.name)
    private readonly authenticateAccountQuery: AuthenticateAccountQuery,

    @Inject(ImplRefreshTokenQuery.name)
    private readonly refreshTokenQuery: RefreshTokenQuery,

    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AccountsController.name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiCreatedResponse({ description: 'Account created!' })
  @ApiNotFoundResponse({ type: NotFoundOutput })
  @ApiBadRequestResponse({ type: BadRequestOutput })
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

      throw ExceptionMapper(response.value);
    }

    this.logger.log('Infra > Http > Controller > Create Account > Success', {
      email,
      username,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiOkResponse({ type: AuthenticateAccountOutput })
  @ApiNotFoundResponse({ type: NotFoundOutput })
  @ApiBadRequestResponse({ type: BadRequestOutput })
  @ApiUnauthorizedResponse({ type: NotAuthorizedOutput })
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

      throw ExceptionMapper(response.value);
    }

    this.logger.log(
      'Infra > Http > Controller > Authenticate Account > Success',
      {
        email,
      },
    );

    return response.value;
  }

  @Patch('me/refresh-token')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiOkResponse({ type: AuthenticateAccountOutput })
  @ApiUnauthorizedResponse({ type: NotAuthorizedOutput })
  async reAuthenticateAccount(
    @RequiredHeaders(['Authorization']) headers: FastifyRequest['headers'],
  ): Promise<AuthenticateAccountOutput> {
    const response = await this.refreshTokenQuery.handle({
      refreshToken: headers['authorization']!,
    });

    if (response.hasError) {
      this.logger.warn(
        `Infra > Http > Controller > ReAuthenticate Account > Failure: ${response.value.message}`,
      );

      throw ExceptionMapper(response.value);
    }

    return response.value;
  }

  @Get('me')
  @UseGuards(TokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiOkResponse({ type: MeOutput })
  @ApiUnauthorizedResponse({ type: NotAuthorizedOutput })
  async me(@CurrentUser() user: UserRequester): Promise<MeOutput> {
    return user;
  }
}

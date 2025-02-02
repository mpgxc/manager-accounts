import { ImplAuthenticateAccountQuery } from '@application/queries/authenticate-account';
import { ExceptionMapper } from '@commons/errors';
import { AuthenticateAccountQuery } from '@domain/queries/authenticate-account';
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RequiredHeaders } from '../commons';
import { AuthenticateAccountInput } from '../inputs';
import {
  AuthenticateAccountOutput,
  BadRequestOutput,
  NotAuthorizedOutput,
  NotFoundOutput,
} from '../outputs/account.output';
@ApiTags('accounts')
@Controller('accounts')
export class AuthenticateController {
  constructor(
    @Inject(ImplAuthenticateAccountQuery.name)
    private readonly authenticateAccountQuery: AuthenticateAccountQuery,

    @LoggerInject(AuthenticateController.name)
    private readonly logger: LoggerService,
  ) {}

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

    if (!response.isOk) {
      this.logger.warn(
        `Infra > Http > Controller > Authenticate Account > Failure: ${response.error.message}`,
      );

      throw ExceptionMapper(response.error);
    }

    this.logger.log(
      'Infra > Http > Controller > Authenticate Account > Success',
      {
        email,
      },
    );

    return response.value;
  }
}

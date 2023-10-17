import { ImplAuthenticateAccountQuery } from '@application/queries/authenticate-account';
import { ExceptionMapper } from '@commons/errors';
import { AuthenticateAccountQuery } from '@domain/queries/authenticate-account';
import { LoggerService } from '@infra/providers/logger/logger.service';
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

    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AuthenticateController.name);
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
}

import { ImplRefreshTokenQuery } from '@application/queries/refresh-token';
import { ExceptionMapper } from '@commons/errors';
import { RefreshTokenQuery } from '@domain/queries/refresh-token';
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { RefreshTokenGuard } from '../auth';
import { RequiredHeaders } from '../commons';
import {
  AuthenticateAccountOutput,
  NotAuthorizedOutput,
} from '../outputs/account.output';

@ApiTags('accounts')
@Controller('accounts')
export class RefreshTokenController {
  constructor(
    @Inject(ImplRefreshTokenQuery.name)
    private readonly refreshTokenQuery: RefreshTokenQuery,

    @LoggerInject(RefreshTokenController.name)
    private readonly logger: LoggerService,
  ) {}

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
}

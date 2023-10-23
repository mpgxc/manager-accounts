import { ImplRefreshTokenQuery } from '@application/queries/refresh-token';
import { RefreshTokenQuery } from '@domain/queries/refresh-token';
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('accounts')
@Controller('accounts')
export class RefreshTokenController {
  constructor(
    @Inject(ImplRefreshTokenQuery.name)
    private readonly refreshTokenQuery: RefreshTokenQuery,

    @LoggerInject(RefreshTokenController.name)
    private readonly logger: LoggerService,
  ) {}

  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  async reAuthenticateAccount(): Promise<void> {}
}

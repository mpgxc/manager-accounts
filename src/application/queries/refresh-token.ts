import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';
import {
  RefreshTokenQuery,
  RefreshTokenQueryInput,
  RefreshTokenQueryOutput,
} from '@domain/queries/refresh-token';
import { LoggerService } from '@infra/providers/logger/logger.service';
import { Injectable } from '@nestjs/common';

@Injectable()
class ImplRefreshTokenQuery implements RefreshTokenQuery {
  constructor(private readonly logger: LoggerService) {}

  async handle({
    refreshToken,
  }: RefreshTokenQueryInput): Promise<RefreshTokenQueryOutput> {
    try {
      return Result.success({
        token: 'token',
        refreshToken: 'refreshToken',
      });
    } catch (error) {
      this.logger.error(
        'Application > Command - Refresh Token > Unexpected Error',
        error,
      );

      return Result.failure(
        ApplicationError.build({
          message: `Unexpected error on refresh token! ${
            (error as Error).message
          }`,
          name: 'UnexpectedError',
        }),
      );
    }
  }
}

export { ImplRefreshTokenQuery };

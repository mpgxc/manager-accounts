import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';
import {
  RefreshTokenQuery,
  RefreshTokenQueryInput,
  RefreshTokenQueryOutput,
} from '@domain/queries/refresh-token';
import { AccountRepository } from '@domain/repositories/account-repository';
import { Token, TokenRepository } from '@domain/repositories/token-repository';
import { ImplAccountRepository } from '@infra/database/repositories';
import { ImplTokenRepository } from '@infra/database/repositories/token-repository';
import { TokenPayloadInput } from '@infra/http/auth';
import { ImplTokensProvider } from '@infra/providers/tokens';
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';

@Injectable()
class ImplRefreshTokenQuery implements RefreshTokenQuery {
  constructor(
    @Inject(ImplTokenRepository.name)
    private readonly tokenRepository: TokenRepository,

    @Inject(ImplAccountRepository.name)
    private readonly accountRepository: AccountRepository,

    @LoggerInject(ImplRefreshTokenQuery.name)
    private readonly logger: LoggerService,

    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly tokens: ImplTokensProvider,
  ) {}

  async handle(
    props: RefreshTokenQueryInput,
  ): Promise<RefreshTokenQueryOutput> {
    try {
      const refreshTokenExists = await this.tokenRepository.exists(
        props.refreshToken,
      );

      if (!refreshTokenExists) {
        return Result.failure(
          ApplicationError.build({
            message: 'Cant refresh token! Invalid refresh token!',
            name: 'CantRefreshToken',
          }),
        );
      }

      const { sub, tenantCode } = this.jwtService.decode(
        props.refreshToken,
      ) as TokenPayloadInput;

      const account = await this.accountRepository.findById(sub);

      if (!account) {
        return Result.failure(
          ApplicationError.build({
            message: 'Cant refresh token! Invalid refresh token!',
            name: 'CantRefreshToken',
          }),
        );
      }

      await this.tokens.onInit(tenantCode);

      const token = await this.tokens.buildAccessToken(
        {
          email: account.props.email,
          username: account.props.username,
          roles: account.rolePermissions,
          tenantCode,
        },
        {
          issuer: tenantCode,
          subject: account.id,
        },
      );

      const refreshToken = await this.tokens.buildRefreshToken(
        {
          tenantCode,
        },
        {
          issuer: tenantCode,
          subject: account.id,
        },
      );

      const expiresIn = dayjs().add(
        this.config.getOrThrow<number>('JWT.JWT_REFRESH_EXPIRES_IN'),
        'minutes',
      );

      /**
       * Observação: O refresh token não está sendo criptografado
       * TODO: Criptografar refresh token
       * TODO: Refatorar o armazenamento de refresh tokens para um redis
       */
      await this.tokenRepository.update(
        Token.build({
          accountId: account.id,
          expiresIn: expiresIn.toDate(),
          refreshToken,
        }),
      );

      return Result.success({
        token,
        refreshToken,
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

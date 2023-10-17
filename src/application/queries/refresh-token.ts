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
import { LoggerService } from '@infra/providers/logger/logger.service';
import { SecretsManagerOutput } from '@infra/providers/secrets-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache as Cachemanager } from 'cache-manager';
import dayjs from 'dayjs';
import { decode } from 'jsonwebtoken';

/**
 * @implements {RefreshTokenQuery}
 * @description Essa classe será refatora da generalizar a criação de tokens
 */
@Injectable()
class ImplRefreshTokenQuery implements RefreshTokenQuery {
  constructor(
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cachemanager,

    @Inject(ImplTokenRepository.name)
    private readonly tokenRepository: TokenRepository,

    @Inject(ImplAccountRepository.name)
    private readonly accountRepository: AccountRepository,
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

      const { sub } = decode(props.refreshToken) as TokenPayloadInput;

      const account = await this.accountRepository.findById(sub);

      if (!account) {
        return Result.failure(
          ApplicationError.build({
            message: 'Cant authenticate account! Invalid credentials!',
            name: 'CantAuthenticateAccount',
          }),
        );
      }

      const roles = account.props.roles.map((role) => ({
        role: role.props.name,
        permissions: role.props.permissions.map(({ props }) => props.name),
      }));

      const secrets = await this.cacheManager.get<SecretsManagerOutput>(
        `${account.props.tenantCode}_SECRETS`,
      );

      if (!secrets) {
        return Result.failure(
          ApplicationError.build({
            message: 'Cant authenticate account! Invalid credentials!',
            name: 'CantAuthenticateAccount',
          }),
        );
      }

      const token = await this.jwtService.signAsync(
        {
          email: account.props.email,
          username: account.props.username,
          tenantCode: account.props.tenantCode,
          roles,
        },
        {
          privateKey: secrets.value.jwt_secret_key,
          audience: 'AccessToken',
          issuer: `uzze_accounts_${account.props.tenantCode}`,
          expiresIn: `${this.config.get('JWT.JWT_TOKEN_EXPIRES_IN')}m`,
          subject: account.id,
          header: {
            typ: 'JWT',
            alg: 'RS256',
          },
        },
      );

      const refreshExpiresIn = this.config.getOrThrow<number>(
        'JWT.JWT_REFRESH_EXPIRES_IN',
      );

      const refreshTokenExpiresIn = dayjs().add(refreshExpiresIn, 'minutes');

      const refreshToken = await this.jwtService.signAsync(
        {
          tenantCode: account.props.tenantCode,
        },
        {
          privateKey: secrets.value.jwt_refresh_secret_key,
          audience: 'RefreshToken',
          issuer: `uzze_accounts_${account.props.tenantCode}`,
          expiresIn: `${refreshExpiresIn}m`,
          subject: account.id,
          header: {
            typ: 'RJWT',
            alg: 'RS256',
          },
        },
      );

      await this.tokenRepository.update(
        Token.build({
          accountId: account.id,
          expiresIn: refreshTokenExpiresIn.toDate(),
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

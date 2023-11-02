import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';
import {
  AuthenticateAccountQuery,
  AuthenticateAccountQueryInput,
  AuthenticateAccountQueryOutput,
} from '@domain/queries/authenticate-account';
import { AccountRepository } from '@domain/repositories/account-repository';
import { Token, TokenRepository } from '@domain/repositories/token-repository';
import { ImplAccountRepository } from '@infra/database/repositories';
import { ImplTokenRepository } from '@infra/database/repositories/token-repository';
import { ImplHasherProvider } from '@infra/providers/hasher';
import { ImplTokensProvider } from '@infra/providers/tokens';
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';

@Injectable()
class ImplAuthenticateAccountQuery implements AuthenticateAccountQuery {
  constructor(
    @Inject(ImplAccountRepository.name)
    private readonly accountRepository: AccountRepository,

    @Inject(ImplTokenRepository.name)
    private readonly tokenRepository: TokenRepository,

    @LoggerInject(ImplAuthenticateAccountQuery.name)
    private readonly logger: LoggerService,

    private readonly hasher: ImplHasherProvider,
    private readonly tokens: ImplTokensProvider,
    private readonly config: ConfigService,
  ) {}

  async handle({
    email,
    password,
    tenantCode,
  }: AuthenticateAccountQueryInput): Promise<AuthenticateAccountQueryOutput> {
    try {
      await this.tokens.onInit(tenantCode);

      const account = await this.accountRepository.findBy({
        email,
        tenantCode,
      });

      if (!account) {
        return Result.Err(
          ApplicationError.build({
            message: 'Cant authenticate account! Invalid credentials!',
            name: 'CantAuthenticateAccount',
          }),
        );
      }

      const passwordMatch = await this.hasher.isMatch(
        password,
        account.props.password,
      );

      if (!passwordMatch) {
        return Result.Err(
          ApplicationError.build({
            message: 'Cant authenticate account! Invalid credentials!',
            name: 'CantAuthenticateAccount',
          }),
        );
      }

      const token = await this.tokens.buildAccessToken(
        {
          email: account.props.email,
          username: account.props.username,
          tenantCode,
          roles: account.rolePermissions,
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

      /**
       * Evita colisão de refresh tokens
       * TODO: Implementar range de tempo para gerar novos refresh tokens
       */
      if (await this.tokenRepository.exists(refreshToken)) {
        return Result.Err(
          ApplicationError.build({
            message: 'Cant authenticate account! Many refresh tokens!',
            name: 'ConflictManySessionsRequest',
          }),
        );
      }

      const expiresIn = dayjs().add(
        this.config.getOrThrow<number>('JWT.JWT_REFRESH_EXPIRES_IN'),
        'minutes',
      );

      await this.tokenRepository.updateOrCreate(
        Token.build({
          accountId: account.id,
          expiresIn: expiresIn.toDate(),
          refreshToken,
        }),
      );

      return Result.Ok({
        token,
        refreshToken,
      });
    } catch (error) {
      this.logger.error(
        'Application > Command - Authenticate Account > Unexpected Error',
        error,
      );

      return Result.Err(
        ApplicationError.build({
          message: `Unexpected error on authenticate account! ${
            (error as Error).message
          }`,
          name: 'UnexpectedError',
        }),
      );
    }
  }
}

export { ImplAuthenticateAccountQuery };

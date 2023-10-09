import { ImplRegisterAccountCommand } from '@application/commands/register-account';
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
import { LoggerService } from '@infra/providers/logger/logger.service';
import { SecretsManagerOutput } from '@infra/providers/secrets-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';

type MixinAuthenticateRepository = {
  tokens: TokenRepository;
  accounts: AccountRepository;
};

@Injectable()
class ImplAuthenticateAccountQuery implements AuthenticateAccountQuery {
  private repository!: MixinAuthenticateRepository;

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @Inject(ImplAccountRepository.name)
    private readonly accountRepository: AccountRepository,

    @Inject(ImplTokenRepository.name)
    private readonly tokenRepository: TokenRepository,

    private readonly hasher: ImplHasherProvider,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.logger.setContext(ImplRegisterAccountCommand.name);

    this.repository = {
      tokens: this.tokenRepository,
      accounts: this.accountRepository,
    };
  }

  async handle({
    email,
    password,
    tenantCode,
  }: AuthenticateAccountQueryInput): Promise<AuthenticateAccountQueryOutput> {
    try {
      const account = await this.repository.accounts.findBy({
        email,
        tenantCode,
      });

      if (!account) {
        return Result.failure(
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
        return Result.failure(
          ApplicationError.build({
            message: 'Cant authenticate account! Invalid credentials!',
            name: 'CantAuthenticateAccount',
          }),
        );
      }

      //TODO: Tem que virar mapper!
      const roles = account.props.roles.map((role) => ({
        role: role.props.name,
        permissions: role.props.permissions.map(({ props }) => props.name),
      }));

      const secrets = await this.cacheManager.get<SecretsManagerOutput>(
        `${tenantCode}_SECRETS`,
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
          issuer: `uzze_accounts_${tenantCode}`,
          expiresIn: `${this.config.get('JWT.JWT_TOKEN_EXPIRES_IN')}m`,
          subject: account.id,
          header: {
            typ: 'JWT',
            alg: 'RS256',
          },
        },
      );

      const refreshExpiresIn = Number(
        this.config.get('JWT.JWT_REFRESH_EXPIRES_IN'),
      );

      const refreshTokenExpiresIn = dayjs().add(refreshExpiresIn, 'minutes');

      const refreshToken = await this.jwtService.signAsync(
        {
          tenantCode,
        },
        {
          privateKey: secrets.value.jwt_refresh_secret_key,
          audience: 'RefreshToken',
          issuer: `uzze_accounts_${tenantCode}`,
          expiresIn: `${refreshTokenExpiresIn.minute()}m`,
          subject: account.id,
          header: {
            typ: 'RJWT',
            alg: 'RS256',
          },
        },
      );

      if (await this.repository.tokens.findById(refreshToken)) {
        return Result.failure(
          ApplicationError.build({
            message: 'Cant authenticate account! Many refresh tokens!',
            name: 'UnexpectedError',
          }),
        );
      }

      await this.repository.tokens.create(
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
        'Application > Command - Authenticate Account > Unexpected Error',
        error,
      );

      return Result.failure(
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

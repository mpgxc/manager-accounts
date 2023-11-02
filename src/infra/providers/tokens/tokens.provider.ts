import { AsyncResult, Maybe, Result } from '@commons/logic';
import { SecretsManagerOutput } from '@infra/providers/secrets-manager';
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache as Cachemanager } from 'cache-manager';
import { TokenOptions, TokensProvider } from './tokens.interface';

@Injectable()
export class ImplTokensProvider implements TokensProvider {
  private secrets!: Maybe<SecretsManagerOutput>;

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cachemanager,

    @LoggerInject(ImplTokensProvider.name)
    private readonly logger: LoggerService,

    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private async fetchSecrets(
    tenantCode: string,
  ): AsyncResult<SecretsManagerOutput, null> {
    try {
      const secrets = await this.cacheManager.get<SecretsManagerOutput>(
        `${tenantCode}_SECRETS`,
      );

      return secrets ? Result.Ok(secrets) : Result.Err(null);
    } catch (error) {
      return Result.Err(null);
    }
  }

  /**
   * @description Initialize secrets from cache
   */
  async onInit(tenantCode: string): Promise<void> {
    this.logger.log(`Initializing secrets for tenant ${tenantCode}`);

    const secrets = await this.fetchSecrets(tenantCode);

    if (!secrets.isOk) {
      this.logger.error(`Cant get secrets for tenant ${tenantCode}`);

      throw new Error('Cant get secrets!');
    }

    this.logger.log(`Secrets for tenant ${tenantCode} initialized!`);

    this.secrets = secrets.value;
  }

  async buildRefreshToken<T extends object>(
    payload: T,
    options: TokenOptions,
  ): Promise<string> {
    if (!this.secrets) {
      throw new Error('Secrets not initialized! Please call onInit() first!');
    }

    const expiresIn = `${this.config.get('JWT.JWT_REFRESH_EXPIRES_IN')}m`;

    return this.jwtService.signAsync(payload, {
      privateKey: this.secrets.value.jwt_refresh_secret_key,
      issuer: `uzze_accounts_${options.issuer}`,
      audience: 'RefreshToken',
      subject: options.subject,
      expiresIn,
      header: {
        typ: 'RJWT',
        alg: 'RS256',
      },
    });
  }

  async buildAccessToken<T extends object>(
    payload: T,
    options: TokenOptions,
  ): Promise<string> {
    if (!this.secrets) {
      throw new Error('Secrets not initialized! Please call onInit() first!');
    }

    const expiresIn = `${this.config.get('JWT.JWT_TOKEN_EXPIRES_IN')}m`;

    return this.jwtService.signAsync(payload, {
      issuer: `uzze_accounts_${options.issuer}`,
      audience: 'AccessToken',
      expiresIn,
      privateKey: this.secrets.value.jwt_secret_key,
      subject: options.subject,
      header: {
        typ: 'JWT',
        alg: 'RS256',
      },
    });
  }
}

import { ImplGetAccountQuery } from '@application/queries/get-account';
import { CacheTTL } from '@commons/types';
import {
  GetAccountQuery,
  GetAccountQueryOutputProps,
} from '@domain/queries/get-account';
import { LoggerService } from '@infra/providers/logger/logger.service';
import {
  SecretsManagerOutput,
  SecretsManagerProviderImpl,
} from '@infra/providers/secrets-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache as CacheManager } from 'cache-manager';
import { decode } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';

export type TokenPayloadInput = {
  email: string;
  username: string;
  tenantCode: string;
  roles: Role[];
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
};

export type Role = {
  role: string;
  permissions: string[];
};

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(ImplGetAccountQuery.name)
    private readonly getAccountQuery: GetAccountQuery,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,

    private readonly logger: LoggerService,
    private readonly secretsManager: SecretsManagerProviderImpl,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: TokenStrategy.getSecretKey(
        cacheManager,
        secretsManager,
      ),
    });

    this.logger.setContext(TokenStrategy.name);
  }

  private static getSecretKey =
    (cacheManager: CacheManager, secretsManager: SecretsManagerProviderImpl) =>
    async (
      _: Request,
      jwtToken: string,
      done: (unknown?: any, secret?: string) => void,
    ) => {
      const user = decode(jwtToken) as TokenPayloadInput;

      let secrets = await cacheManager.get<SecretsManagerOutput>(
        `${user.tenantCode}_SECRETS`,
      );

      if (!secrets) {
        secrets = await firstValueFrom(
          secretsManager.get({ key: user.tenantCode }),
        );

        await cacheManager.set(
          `${user.tenantCode}_SECRETS`,
          secrets,
          CacheTTL.ONE_DAY,
        );
      }

      return done(null, secrets?.value.jwt_public_key);
    };

  async validate(
    payload: TokenPayloadInput,
  ): Promise<GetAccountQueryOutputProps> {
    this.logger.log('Http > Auth > Token Strategy > Validate');

    /**
     * Maybe we can use a cache here, but for now we will use the database
     * because it is simpler and also because, by using the update token strategy,
     * we can avoid too many requests to the database,
     * keeping the user logged in for a long time
     */
    const account = await this.getAccountQuery.handle({
      id: payload.sub,
      tenantCode: payload.tenantCode,
    });

    if (account.hasError) {
      this.logger.warn(
        `Http > Auth > Token Strategy > ${account.value.message}`,
      );

      throw new UnauthorizedException(
        `You don't have permission! ${account.value.message}`,
      );
    }

    this.logger.log('Http > Auth > Token Strategy > Success');

    return account.value;
  }
}

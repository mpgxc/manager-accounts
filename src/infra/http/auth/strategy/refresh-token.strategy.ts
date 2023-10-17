import { ImplGetAccountQuery } from '@application/queries/get-account';
import { CacheTTL } from '@commons/types';
import { GetAccountQuery } from '@domain/queries/get-account';
import { UserRequester } from '@global/fastify';
import { LoggerService } from '@infra/providers/logger/logger.service';
import {
  ImplSecretsManagerProvider,
  SecretsManagerOutput,
} from '@infra/providers/secrets-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache as CacheManager } from 'cache-manager';
import { FastifyRequest } from 'fastify';
import { decode } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';
import { TokenPayloadInput } from './token.strategy';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @Inject(ImplGetAccountQuery.name)
    private readonly getAccountQuery: GetAccountQuery,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,

    private readonly logger: LoggerService,
    private readonly secretsManager: ImplSecretsManagerProvider,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: RefreshTokenStrategy.getSecretKey(
        cacheManager,
        secretsManager,
      ),
    });

    this.logger.setContext(RefreshTokenStrategy.name);
  }

  private static getSecretKey =
    (cacheManager: CacheManager, secretsManager: ImplSecretsManagerProvider) =>
    async (
      request: FastifyRequest,
      jwtToken: string,
      done: (unknown?: any, secret?: string) => void,
    ) => {
      const user = decode(jwtToken) as TokenPayloadInput;

      if (!user) return done();

      request.headers['authorization'] = request.headers.authorization
        ?.replace('Bearer', '')
        .trim();

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

      return done(null, secrets.value.jwt_refresh_public_key);
    };

  async validate(
    _: FastifyRequest,
    payload: TokenPayloadInput,
  ): Promise<UserRequester> {
    this.logger.log('Http > Auth > Refresh Token Strategy > Validate');

    const account = await this.getAccountQuery.handle({
      id: payload.sub,
      tenantCode: payload.tenantCode,
    });

    if (account.hasError) {
      this.logger.warn(
        `Http > Auth > Refresh Token Strategy > ${account.value.message}`,
      );

      throw new UnauthorizedException(
        `You don't have permission! ${account.value.message}`,
      );
    }

    this.logger.log('Http > Auth > Refresh Token Strategy > Success');

    return account.value;
  }
}

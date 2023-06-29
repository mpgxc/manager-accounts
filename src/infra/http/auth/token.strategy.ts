import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ImplGetAccountCommand } from 'application/queries/get-account';
import { Cache } from 'cache-manager';
import { GetAccountCommand } from 'domain/queries/get-account';
import { LoggerService } from 'infra/providers/logger/logger.service';
import { SecretsManagerOutput } from 'infra/providers/secrets-manager/secrets-manager.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type TokenPayload = {
  sub: string;
  email: string;
  username: string;
  tenantCode: string;
  roles: Role[];
  iat: number;
  exp: number;
};

export type Role = {
  role: string;
  permissions: string[];
};

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(ImplGetAccountCommand.name)
    private readonly getAccountCommand: GetAccountCommand,
    private readonly logger: LoggerService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request, __, done) => {
        const tenantCode = request.headers['x-tenant-id'] as string;

        const secrets = await this.cacheManager.get<SecretsManagerOutput>(
          tenantCode,
        );

        return done(null, secrets?.value.jwt_public_key);
      },
    });

    this.logger.setContext(TokenStrategy.name);
  }

  async validate(payload: TokenPayload): Promise<TokenPayload> {
    this.logger.log('Http > Auth > Token Strategy > Validate');

    /**
     * Maybe we can use a cache here, but for now we will use the database
     * because it is simpler and also because, by using the update token strategy,
     * we can avoid too many requests to the database,
     * keeping the user logged in for a long time
     */
    const account = await this.getAccountCommand.handle({
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
    return payload;
  }
}

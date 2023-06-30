import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ImplGetAccountCommand } from 'application/queries/get-account';
import { Cache } from 'cache-manager';
import { GetAccountCommand } from 'domain/queries/get-account';
import { LoggerService } from 'infra/providers/logger/logger.service';
import { SecretsManagerOutput } from 'infra/providers/secrets-manager/secrets-manager.interface';
import { ImplSecretsManagerProvider } from 'infra/providers/secrets-manager/secrets-manager.provider';
import { decode } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';

export type TokenPayloadInput = {
  sub: string;
  email: string;
  username: string;
  tenantCode: string;
  roles: Role[];
  iat: number;
  exp: number;
};

export type TokenPayloadOutput = {
  id: string;
  name: string;
  username: string;
  lastName: string;
  phone: string;
  email: string;
  avatar: string;
  tenantCode: string;
  roles: Array<{
    role: string;
    permissions: Array<string>;
  }>;
};

export type Role = {
  role: string;
  permissions: string[];
};

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ImplGetAccountCommand.name)
    private readonly getAccountCommand: GetAccountCommand,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    private readonly logger: LoggerService,
    private readonly secretsManager: ImplSecretsManagerProvider,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (
        request: Request,
        jwtToken: string,
        done: (unknown: null, secret: string) => void,
      ) => {
        const user = decode(jwtToken) as TokenPayloadInput;

        let secrets = await this.cacheManager.get<SecretsManagerOutput>(
          `${user.tenantCode}_SECRETS`,
        );

        if (!secrets) {
          secrets = await firstValueFrom(
            this.secretsManager.get({ key: user.tenantCode }),
          );

          await this.cacheManager.set(`${user.tenantCode}_SECRETS`, secrets);
        }

        return done(null, secrets?.value.jwt_public_key as string);
      },
    });

    this.logger.setContext(TokenStrategy.name);
  }

  async validate(payload: TokenPayloadInput): Promise<TokenPayloadOutput> {
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

    return account.value;
  }
}

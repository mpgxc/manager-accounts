import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ImplGetAccountCommand } from 'application/queries/get-account';
import { GetAccountCommand } from 'domain/queries/get-account';
import { LoggerService } from 'infra/providers/logger/logger.service';
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
    @Inject(ImplGetAccountCommand.name)
    private readonly getAccountCommand: GetAccountCommand,
    private readonly logger: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAttKlBRZpgMaEt443asxE\nLN8EI1NKPdV11KFiDwvA/HIcxreYTzVOI85pnEiVtziOKbZxEXB6Qgo0mG9QeoCu\nzbcBrOsiRXr8FLnj6/nguDljCSsNb0OURR0uMxhqo459rdmSZWcKSZsx2uvMka7L\nDxXnY9i5WprbequRkJK6eGNqtK/6UtNA9mP5awECjdn/fupzhJUUtZKm6ehIA6He\n6J0Qd9RKJt5tF+/JyZg5aEq5Cr2trPE8S7IEli3I0laLFAnSVakb71+/2KdjXP8/\naBcqKoz9StqwGGg3YwtMImTkZOUzX7/zwBPGHT2OQIIDuVAjnGupRhtFcwAxScw6\nyQIDAQAB\n-----END PUBLIC KEY-----',
    });
  }

  async validate(payload: TokenPayload) {
    this.logger.log('Http > Auth > Token Strategy > Validate');

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

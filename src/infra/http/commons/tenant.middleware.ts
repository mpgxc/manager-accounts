import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NextFunction, Request, Response } from 'express';
import { SecretsManagerOutput } from 'infra/providers/secrets-manager/secrets-manager.interface';
import { ImplSecretsManagerProvider } from 'infra/providers/secrets-manager/secrets-manager.provider';
import { firstValueFrom } from 'rxjs';
import { TenantHeader } from '../inputs/headers.input';
import { InputDtosValidate } from './input-dtos-validate';

@Injectable()
export class TenantMiddleware
  extends InputDtosValidate
  implements NestMiddleware
{
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly secretsManager: ImplSecretsManagerProvider,
  ) {
    super();
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantCode = req.headers['x-tenant-id'] as string;

    const instance = Object.assign(new TenantHeader(), {
      ['x-tenant-id']: tenantCode,
    });

    const { exceptions, hasError } = await this.validate<TenantHeader>(
      instance,
    );

    if (hasError) {
      throw new BadRequestException(exceptions);
    }

    let secrets = await this.cacheManager.get<SecretsManagerOutput>(tenantCode);

    if (secrets) {
      return next();
    }

    secrets = await firstValueFrom(
      this.secretsManager.get({ key: tenantCode }),
    );

    await this.cacheManager.set(tenantCode, secrets);

    return next();
  }
}

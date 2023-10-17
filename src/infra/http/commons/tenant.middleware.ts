import { Maybe } from '@commons/logic';
import { CacheTTL } from '@commons/types';
import { Tenant } from '@domain/entities/tenant';
import { TenantRepository } from '@domain/repositories/tenant-repository';
import { ImplTenantRepository } from '@infra/database/repositories';
import {
  ImplSecretsManagerProvider,
  SecretsManagerOutput,
} from '@infra/providers/secrets-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { Cache as Cachemanager } from 'cache-manager';
import { FastifyReply, FastifyRequest } from 'fastify';
import { firstValueFrom } from 'rxjs';
import { TenantHeader } from '../inputs';
import { InputDtosValidate } from './input-dtos-validate';

@Injectable()
export class TenantMiddleware
  extends InputDtosValidate
  implements NestMiddleware
{
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cachemanager,
    private readonly secretsManager: ImplSecretsManagerProvider,

    @Inject(ImplTenantRepository.name)
    private readonly tenantRepository: TenantRepository,
  ) {
    super();
  }

  private async tenantExists(tenantCode: string) {
    let tenant = await this.cacheManager.get<Maybe<Tenant>>(
      `${tenantCode}_ENTITY`,
    );

    if (!tenant) {
      tenant = await this.tenantRepository.findById(tenantCode);

      if (!tenant) {
        return false;
      }

      await this.cacheManager.set(
        `${tenantCode}_ENTITY`,
        tenant.id,
        CacheTTL.ONE_DAY,
      );
    }

    return true;
  }

  async use(req: FastifyRequest, _res: FastifyReply, next: () => void) {
    const tenantCode = req.headers['x-tenant-id'] as string;

    const instance = Object.assign(new TenantHeader(), {
      ['x-tenant-id']: tenantCode,
    });

    const { exceptions, hasError } =
      await this.validate<TenantHeader>(instance);

    if (hasError) {
      throw new BadRequestException(exceptions);
    }

    if (!(await this.tenantExists(tenantCode))) {
      throw new NotFoundException('Tenant not found!');
    }

    {
      let secrets = await this.cacheManager.get<SecretsManagerOutput>(
        `${tenantCode}_SECRETS`,
      );

      if (secrets) {
        return next();
      }

      secrets = await firstValueFrom(
        this.secretsManager.get({ key: tenantCode }),
      );

      await this.cacheManager.set(
        `${tenantCode}_SECRETS`,
        secrets,
        CacheTTL.ONE_DAY,
      );
    }

    return next();
  }
}

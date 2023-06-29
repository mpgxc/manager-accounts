import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError } from 'commons/errors';
import { Result } from 'commons/logic';
import {
  RegisterTenantCommand,
  RegisterTenantCommandInput,
  RegisterTenantCommandOutput,
} from 'domain/commands/register-tenant';
import { Tenant } from 'domain/entities/tenant';
import { TenantRepository } from 'domain/repositories/tenant-repository';
import { ImplTenantRepository } from 'infra/database/repositories';
import { LoggerService } from 'infra/providers/logger/logger.service';

@Injectable()
class ImplRegisterTenantCommand implements RegisterTenantCommand {
  constructor(
    @Inject(ImplTenantRepository.name)
    private readonly tenantRepository: TenantRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ImplRegisterTenantCommand.name);
  }

  async handle({
    name,
    description,
  }: RegisterTenantCommandInput): Promise<RegisterTenantCommandOutput> {
    try {
      const tenant = Tenant.build({
        name,
        description,
      });

      const tenantExists = await this.tenantRepository.findById(name);

      if (tenantExists) {
        return Result.failure(
          ApplicationError.build({
            message: `Tenant ${name} already exists!`,
            name: 'TenantAlreadyExists',
          }),
        );
      }

      await this.tenantRepository.create(tenant);

      return Result.success();
    } catch (error) {
      this.logger.error(
        'Application > Command - Create Tenant > Unexpected Error',
        error,
      );

      return Result.failure(
        ApplicationError.build({
          message: `Unexpected error on create tenant! ${
            (error as Error).message
          }`,
          name: 'UnexpectedError',
        }),
      );
    }
  }
}

export { ImplRegisterTenantCommand };

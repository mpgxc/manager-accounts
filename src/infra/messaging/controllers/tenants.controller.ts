import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ImplRegisterTenantCommand } from 'application/commands/register-tenant';
import { RegisterTenantCommand } from 'domain/commands/register-tenant';
import { LoggerService } from 'infra/providers/logger/logger.service';

type TenantSyncPayload = {
  name: string;
  description: string;
};

@Controller()
export class TenantsController {
  constructor(
    @Inject(ImplRegisterTenantCommand.name)
    private readonly registerTenantCommand: RegisterTenantCommand,
    private readonly logger: LoggerService,
  ) {}

  @EventPattern('tenants.created')
  async handleTenantSync(@Payload() { name, description }: TenantSyncPayload) {
    this.logger.log(`Infra > Messaging > Kafka > Tenants > Syncing ${name}`);

    const response = await this.registerTenantCommand.handle({
      name,
      description,
    });

    if (response.hasError) {
      this.logger.error(
        `Infra > Messaging > Kafka > Tenants > Error syncing tenant ${name}: ${response.value.formatedMessage}`,
      );
    } else {
      this.logger.log(
        `Infra > Messaging > Kafka > Tenants > Success synced ${name}`,
      );
    }
  }
}

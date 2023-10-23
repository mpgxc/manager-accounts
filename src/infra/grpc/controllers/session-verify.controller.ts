import { LoggerService } from '@infra/providers/logger/logger.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { randomInt, randomUUID } from 'node:crypto';

type SessionVerifyInput = {
  token: string;
};

@Controller()
export class SessionVerifyController {
  constructor(private readonly logger: LoggerService) {}

  @GrpcMethod('SessionVerifyService', 'Verify')
  async verify({ token }: SessionVerifyInput): Promise<any> {
    this.logger.log('SessionVerifyService.verify', { token });

    return {
      id: randomUUID(),
      tenantCode: 'tenant_001',
      isValidToken: Boolean(randomInt(2)),
      roles: [
        {
          role: 'Admin',
          permissions: [
            'accounts:read',
            'accounts:create',
            'accounts:update',
            'accounts:delete',
          ],
        },
      ],
    };
  }
}

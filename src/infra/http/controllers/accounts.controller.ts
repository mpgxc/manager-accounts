import { Controller, Post } from '@nestjs/common';
import { ApplicationErrorMapper } from 'commons/errors';
import { LoggerService } from 'infra/providers/logger/logger.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly errorMapper: ApplicationErrorMapper,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async createAccount() {
    return {
      ok: true,
    };
  }
}

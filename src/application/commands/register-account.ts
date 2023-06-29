import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError } from 'commons/errors';
import { Result } from 'commons/logic';
import {
  RegisterAccountCommand,
  RegisterAccountCommandInput,
  RegisterAccountCommandOutput,
} from 'domain/commands/register-account';
import { Account } from 'domain/entities/account';
import { AccountRepository } from 'domain/repositories/account-repository';
import { ImplAccountRepository } from 'infra/database/repositories';
import { ImplHasherProvider } from 'infra/providers/hasher/hasher.provider';
import { LoggerService } from 'infra/providers/logger/logger.service';

@Injectable()
class ImplRegisterAccountCommand implements RegisterAccountCommand {
  constructor(
    @Inject(ImplAccountRepository.name)
    private readonly accountRepository: AccountRepository,
    private readonly hasher: ImplHasherProvider,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ImplRegisterAccountCommand.name);
  }

  async handle({
    name,
    email,
    phone,
    lastName,
    password,
    username,
    tenantCode,
  }: RegisterAccountCommandInput): Promise<RegisterAccountCommandOutput> {
    try {
      const tenantExists = await this.accountRepository.findTenantByName(
        tenantCode,
      );

      if (!tenantExists) {
        return Result.failure(
          ApplicationError.build({
            message: 'Tenant not found!',
            name: 'TenantNotFound',
          }),
        );
      }

      const accountExists = await this.accountRepository.findBy({
        email,
        phone,
        username,
        tenantCode,
      });

      if (accountExists) {
        return Result.failure(
          ApplicationError.build({
            message: 'Account already exists!',
            name: 'AccountAlreadyExists',
          }),
        );
      }

      const account = Account.build({
        name,
        email,
        phone,
        lastName,
        password: await this.hasher.hash(password),
        username,
        tenantCode,
      });

      await this.accountRepository.create(account);

      return Result.success();
    } catch (error) {
      this.logger.error(
        'Application > Command - Create Account > Unexpected Error',
        error,
      );

      return Result.failure(
        ApplicationError.build({
          message: `Unexpected error on create account! ${
            (error as Error).message
          }`,
          name: 'UnexpectedError',
        }),
      );
    }
  }
}

export { ImplRegisterAccountCommand };

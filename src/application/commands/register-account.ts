import { Inject } from '@nestjs/common';
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
  }: RegisterAccountCommandInput): Promise<RegisterAccountCommandOutput> {
    try {
      const accountExists = await this.accountRepository.findBy({
        email,
        phone,
        username,
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

import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';
import {
  RegisterAccountCommand,
  RegisterAccountCommandInput,
  RegisterAccountCommandOutput,
} from '@domain/commands/register-account';
import { Account } from '@domain/entities/account';
import { AccountRepository } from '@domain/repositories/account-repository';
import { ImplAccountRepository } from '@infra/database/repositories';
import { KafkaProducerService } from '@infra/messaging/kafka/kafka-producer.service';
import { ImplHasherProvider } from '@infra/providers/hasher';
import { LoggerService } from '@infra/providers/logger/logger.service';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
class ImplRegisterAccountCommand implements RegisterAccountCommand {
  constructor(
    @Inject(ImplAccountRepository.name)
    private readonly repository: AccountRepository,
    private readonly kafkaService: KafkaProducerService,
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
      const accountExists = await this.repository.findBy({
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

      await this.repository.create(account);

      await firstValueFrom(
        this.kafkaService.emit('tenants.created', account.props),
      );

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

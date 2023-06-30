import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';
import {
  GetAccountCommand,
  GetAccountCommandInput,
  GetAccountCommandOutput,
} from '@domain/queries/get-account';
import { AccountRepository } from '@domain/repositories/account-repository';
import { ImplAccountRepository } from '@infra/database/repositories';
import { LoggerService } from '@infra/providers/logger/logger.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
class ImplGetAccountCommand implements GetAccountCommand {
  constructor(
    @Inject(ImplAccountRepository.name)
    private readonly repository: AccountRepository,
    private readonly logger: LoggerService,
  ) {}

  async handle({
    id,
    email,
    phone,
    username,
    tenantCode,
  }: GetAccountCommandInput): Promise<GetAccountCommandOutput> {
    try {
      this.logger.log('Application > Command > Get Account', {
        email,
        phone,
        username,
        tenantCode,
      });

      const account = id
        ? await this.repository.findById(id)
        : await this.repository.findBy({
            email,
            phone,
            username,
            tenantCode,
          });

      if (!account) {
        this.logger.warn(
          'Application > Command > Get Account > Account not found',
        );

        return Result.failure(
          ApplicationError.build({
            message: 'Account not found!',
            name: 'AccountNotFound',
          }),
        );
      }

      //TODO: Tem que virar mapper!
      const roles = account.props.roles.map((role) => ({
        role: role.props.name,
        permissions: role.props.permissions.map(({ props }) => props.name),
      }));

      //TODO: Tem que virar mapper!
      return Result.success({
        ...account.props,
        id: account.id,
        password: undefined,
        roles,
      });
    } catch (error) {
      this.logger.error(
        'Application > Command - Authenticate Account > Unexpected Error',
        error,
      );

      return Result.failure(
        ApplicationError.build({
          message: `Unexpected error on authenticate account! ${
            (error as Error).message
          }`,
          name: 'UnexpectedError',
        }),
      );
    }
  }
}

export { ImplGetAccountCommand };

import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';
import {
  GetAccountQuery,
  GetAccountQueryInput,
  GetAccountQueryOutput,
} from '@domain/queries/get-account';
import { AccountRepository } from '@domain/repositories/account-repository';
import { ImplAccountRepository } from '@infra/database/repositories';
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
class ImplGetAccountQuery implements GetAccountQuery {
  constructor(
    @Inject(ImplAccountRepository.name)
    private readonly repository: AccountRepository,

    @LoggerInject(ImplGetAccountQuery.name)
    private readonly logger: LoggerService,
  ) {}

  async handle({
    id,
    email,
    phone,
    username,
    tenantCode,
  }: GetAccountQueryInput): Promise<GetAccountQueryOutput> {
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

        return Result.Err(
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
      return Result.Ok({
        ...account.props,
        id: account.id,
        password: undefined,
        roles,
      });
    } catch (error) {
      this.logger.error(
        'Application > Command - Get Account > Unexpected Error',
        error,
      );

      return Result.Err(
        ApplicationError.build({
          message: `Unexpected error on get account! ${
            (error as Error).message
          }`,
          name: 'UnexpectedError',
        }),
      );
    }
  }
}

export { ImplGetAccountQuery };

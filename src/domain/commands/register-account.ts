import { ApplicationError } from 'commons/errors';
import { Either } from 'commons/logic';
import { AccountRepositoryOutput } from '../repositories/account-repository';

type RegisterAccountCommandOutput = Either<
  ApplicationError,
  AccountRepositoryOutput
>;

interface RegisterAccountCommand {
  handle(): Promise<RegisterAccountCommandOutput>;
}

export { RegisterAccountCommand, RegisterAccountCommandOutput };

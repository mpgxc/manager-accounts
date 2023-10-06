import { Repository } from '@commons/interfaces';
import { Maybe } from '@commons/logic';
import { AccountProps } from '@commons/types';
import { Account } from '@domain/entities/account';

type AccountRepositoryOutput = AccountProps;

type AccountRepositoryQueryInput = {
  email?: string;
  phone?: string;
  username?: string;
  tenantCode: string;
};

interface AccountRepository
  extends Repository<Account, AccountRepositoryOutput> {
  findBy(props: AccountRepositoryQueryInput): Promise<Maybe<Account>>;
}

export {
  AccountRepository,
  AccountRepositoryOutput,
  AccountRepositoryQueryInput,
};

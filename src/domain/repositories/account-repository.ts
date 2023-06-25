import { Repository } from 'commons/interfaces';
import { AccountProps } from 'commons/types';
import { Account } from '../entities/account';

type AccountRepositoryOutput = AccountProps;

type AccountRepositoryQueryInput = {
  email?: string;
  phone?: string;
  username?: string;
};

interface AccountRepository
  extends Repository<Account, AccountRepositoryOutput> {
  findBy(props: AccountRepositoryQueryInput): Promise<AccountRepositoryOutput>;
}

export {
  AccountRepository,
  AccountRepositoryOutput,
  AccountRepositoryQueryInput,
};

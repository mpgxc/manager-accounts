import { Repository } from '@commons/interfaces';
import { Maybe } from '@commons/logic';
import { Account, AccountProps } from '@domain/entities/account';

type AccountRepositoryOutput = AccountProps & {
  id: string;
};

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

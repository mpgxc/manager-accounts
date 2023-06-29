import { Repository } from 'commons/interfaces';
import { Maybe } from 'commons/logic';
import { AccountProps } from 'commons/types';
import { Tenant } from 'domain/entities/tenant';
import { Account } from '../entities/account';

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
  findTenantByName(name: string): Promise<Maybe<Tenant>>;
}

export {
  AccountRepository,
  AccountRepositoryOutput,
  AccountRepositoryQueryInput,
};

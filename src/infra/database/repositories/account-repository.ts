import { Maybe } from 'commons/logic';
import { AccountProps } from 'commons/types';
import { Account } from 'domain/entities/account';
import {
  AccountRepository,
  AccountRepositoryQueryInput,
} from 'domain/repositories/account-repository';
import { Paginator, QueryPaginator } from '../helpers/prisma-paginator';

export class ImplAccountRepository implements AccountRepository {
  async findBy(props: AccountRepositoryQueryInput): Promise<AccountProps> {
    throw new Error('Method not implemented.');
  }

  async exists(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async create(item: Account): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(item: Account): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async update(item: Account): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Maybe<AccountProps>> {
    throw new Error('Method not implemented.');
  }

  async list(
    queryPaginator?: QueryPaginator | undefined,
  ): Promise<Paginator<AccountProps>> {
    throw new Error('Method not implemented.');
  }
}

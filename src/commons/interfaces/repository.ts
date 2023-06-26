import { AggregateRoot, Entity } from 'commons/domain';
import { Maybe } from 'commons/logic/maybe';
import {
  Paginator,
  QueryPaginator,
} from 'infra/database/helpers/prisma-paginator';

export interface Repository<Input extends Entity | AggregateRoot, Output> {
  exists(id: string): Promise<boolean>;

  create(item: Input): Promise<void>;

  delete(item: Input): Promise<void>;

  update(item: Input): Promise<void>;

  findById(id: string): Promise<Maybe<Input>>;

  list(queryPaginator?: QueryPaginator): Promise<Paginator<Output>>;
}

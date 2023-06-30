import { Maybe } from '@commons/logic';
import { Prisma, PrismaClient } from '@prisma/client';

export type Paginator<I> = {
  items: Array<I>;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export type QueryPaginator = {
  page?: Maybe<number>;
  pageSize?: Maybe<number>;
  orderBy?: Maybe<'asc' | 'desc'>;
};

export type PrismaPaginatorInput<Include, Where> = {
  table: Prisma.ModelName;
  client: PrismaClient;
  filters: QueryPaginator;
  where?: Where;
  include?: Include;
};

export abstract class PrismaPaginator<Output> {
  async paginate<Include, Where = object>({
    client,
    filters,
    table,
    where,
    include,
  }: PrismaPaginatorInput<Include, Where>): Promise<Paginator<Output>> {
    const totalItems = await client[table].count();

    const totalPages = Math.ceil(totalItems / filters.pageSize!);

    const items = await client[table].findMany({
      take: filters.pageSize!,
      skip: (filters.page! - 1) * filters.pageSize!,
      orderBy: {
        createdAt: filters.orderBy!,
      },
      include,
      where,
    });

    return {
      items,
      totalPages,
      totalItems,
      pageSize: filters.pageSize!,
      currentPage: filters.page!,
    };
  }
}

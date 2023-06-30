import { Maybe } from '@commons/logic';
import { TenantProps } from '@commons/types';
import { Tenant } from '@domain/entities/tenant';
import { TenantRepository } from '@domain/repositories/tenant-repository';
import { Injectable } from '@nestjs/common';
import { Paginator, QueryPaginator } from '../helpers/prisma-paginator';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ImplTenantRepository implements TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(name: string): Promise<boolean> {
    const tenant = await this.prisma.tenants.findUnique({
      where: {
        name,
      },
    });

    return !!tenant;
  }

  async create(item: Tenant): Promise<void> {
    await this.prisma.tenants.create({
      data: {
        ...item.props,
        accounts: {},
      },
    });
  }

  async delete(item: Tenant): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async update(item: Tenant): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Maybe<Tenant>> {
    const tenant = await this.prisma.tenants.findUnique({
      where: {
        name: id,
      },
    });

    return tenant
      ? Tenant.build({
          name: tenant.name,
          accounts: [],
        })
      : null;
  }

  async list(
    queryPaginator?: QueryPaginator | undefined,
  ): Promise<Paginator<TenantProps>> {
    throw new Error('Method not implemented.');
  }
}

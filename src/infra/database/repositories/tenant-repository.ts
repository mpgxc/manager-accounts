import { Maybe } from '@commons/logic';
import { Tenant } from '@domain/entities/tenant';
import { TenantRepository } from '@domain/repositories/tenant-repository';
import { Injectable } from '@nestjs/common';
import { TenantMapper } from '../mappers/tenant-mapper';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ImplTenantRepository implements TenantRepository {
  constructor(
    private readonly mapper: TenantMapper,
    private readonly prisma: PrismaService,
  ) {}

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
      data: this.mapper.toPersistense(item),
    });
  }

  async findById(name: string): Promise<Maybe<Tenant>> {
    const tenant = await this.prisma.tenants.findUnique({
      where: {
        name,
      },
    });

    return tenant ? this.mapper.toDomain(tenant) : null;
  }
}

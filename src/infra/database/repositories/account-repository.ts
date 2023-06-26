import { Injectable } from '@nestjs/common';
import { Maybe } from 'commons/logic';
import { AccountProps } from 'commons/types';
import { Account } from 'domain/entities/account';
import { Permissions } from 'domain/entities/permissions';
import { Roles } from 'domain/entities/roles';
import {
  AccountRepository,
  AccountRepositoryQueryInput,
} from 'domain/repositories/account-repository';
import { Paginator, QueryPaginator } from '../helpers/prisma-paginator';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ImplAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBy({
    email,
    phone,
    username,
  }: AccountRepositoryQueryInput): Promise<Maybe<Account>> {
    const account = await this.prisma.accounts.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            phone,
          },
          {
            username,
          },
        ],
      },
      include: {
        roles: {
          select: {
            roles: {
              include: {
                rolesPermissions: {
                  select: {
                    permissions: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    //TODO: Refactor this to a mapper
    const roles = account?.roles
      .map((role) => ({
        id: role.roles.id,
        name: role.roles.name,
        description: role.roles.description,
        permissions: role.roles.rolesPermissions.map((rolePermission) => ({
          id: rolePermission.permissions.id,
          name: rolePermission.permissions.name,
          description: rolePermission.permissions.description,
          createdAt: rolePermission.permissions.createdAt,
          updatedAt: rolePermission.permissions.updatedAt,
        })),
      }))
      .map(({ id, permissions, description, name }) =>
        Roles.build(
          {
            description: description as string,
            name,
            permissions: permissions.map(
              ({ description, id, name, createdAt, updatedAt }) =>
                Permissions.build(
                  {
                    description: description as string,
                    name,
                    createdAt,
                    updatedAt,
                  },
                  id,
                ),
            ),
          },
          id,
        ),
      );

    return account
      ? Account.build(
          {
            email: account.email,
            lastName: account.lastName,
            name: account.name,
            password: account.password,
            phone: account.phone,
            username: account.username,
            avatar: account.avatar ?? '-',
            createdAt: account.createdAt,
            emailVerified: account.emailVerified,
            lastAccess: account.lastAccess,
            acceptedTerms: account.acceptedTerms,
            updatedAt: account.updatedAt,
            roles,
          },
          account.id,
        )
      : null;
  }

  async exists(id: string): Promise<boolean> {
    const account = await this.prisma.accounts.findUnique({
      where: {
        id,
      },
    });

    return !!account;
  }

  async create(item: Account): Promise<void> {
    await this.prisma.accounts.create({
      data: {
        ...item.props,
        id: item.id,
        roles: {},
      },
    });
  }

  async delete(item: Account): Promise<void> {
    await this.prisma.accounts.delete({
      where: {
        id: item.id,
      },
    });
  }

  async update(item: Account): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Maybe<Account>> {
    throw new Error('Method not implemented.');
  }

  async list(
    queryPaginator?: QueryPaginator | undefined,
  ): Promise<Paginator<AccountProps>> {
    throw new Error('Method not implemented.');
  }
}

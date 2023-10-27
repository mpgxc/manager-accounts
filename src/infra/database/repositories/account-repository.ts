import { Maybe } from '@commons/logic';
import { Account } from '@domain/entities/account';
import { Permissions } from '@domain/entities/permissions';
import { Roles } from '@domain/entities/roles';
import {
  AccountRepository,
  AccountRepositoryOutput,
  AccountRepositoryQueryInput,
} from '@domain/repositories/account-repository';
import { Injectable } from '@nestjs/common';
import { Paginator, QueryPaginator } from '../helpers/prisma-paginator';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ImplAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique({
    email,
    phone,
    username,
    tenantCode,
  }: Required<AccountRepositoryQueryInput>): Promise<Maybe<Account>> {
    const account = await this.prisma.accounts.findUnique({
      where: {
        tenantCode_username_email_phone: {
          username,
          email,
          phone,
          tenantCode,
        },
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
        tenant: true,
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
            tenantCode: account.tenant.name,
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

  async findBy({
    email,
    phone,
    username,
    tenantCode,
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
        AND: {
          tenantCode,
        },
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
        tenant: true,
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
            tenantCode: account.tenant.name,
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

  //TODO: Refactor this to a mapper
  async findById(id: string): Promise<Maybe<Account>> {
    const account = await this.prisma.accounts.findUnique({
      where: {
        id,
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
        tenant: true,
      },
    });

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
            tenantCode: account.tenant.name,
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

  list(
    queryPaginator?: Maybe<QueryPaginator>,
  ): Promise<Paginator<AccountRepositoryOutput>> {
    throw new Error('Method not implemented.');
  }
}

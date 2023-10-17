import { SetMetadata } from '@nestjs/common';

enum Resources {
  All = 'all',
  Orders = 'orders',
  Products = 'products',
  Accounts = 'accounts',
  Establishments = 'establishments',
}

enum Actions {
  All = 'all',
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export const PERMISSIONS_KEY = 'permissions';

export type Permissions = `${Resources}:${Actions}`;

export const Permissions = (...permissions: Permissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

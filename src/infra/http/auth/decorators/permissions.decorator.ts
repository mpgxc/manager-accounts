import { SetMetadata } from '@nestjs/common';

export enum ServicesEnum {
  Orders = 'orders',
  Products = 'products',
  Accounts = 'accounts',
  Establishments = 'establishments',
}

export enum ActionsEnum {
  All = 'all',
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export const PERMISSIONS_KEY = 'permissions';

export type PermissionsUnion = `${ServicesEnum}:${ActionsEnum}`;

export const Permissions = (...permissions: PermissionsUnion[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

import { SetMetadata } from '@nestjs/common';

export enum RolesEnum {
  Admin = 'Admin',
  Customer = 'Customer',
  Establishment = 'Establishment',
}

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);

import { SetMetadata } from '@nestjs/common';

export type RolesUnion = 'Admin' | 'Customer' | 'Establishment';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RolesUnion[]) => SetMetadata(ROLES_KEY, roles);

import { UserRequester } from '@global/fastify';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  Permissions,
} from '../decorators/permissions.decorator';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permissions[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{
      user: UserRequester;
    }>();

    return requiredPermissions.some((role) =>
      user.roles.find((r) => r.permissions.includes(role.toString())),
    );
  }
}

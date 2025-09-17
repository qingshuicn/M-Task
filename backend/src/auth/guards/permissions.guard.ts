import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthenticatedUser } from '../interfaces/auth-user.interface';

type RequestWithAuthContext = Request & {
  user?: AuthenticatedUser;
  userPermissions?: string[];
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuthContext>();
    const user: AuthenticatedUser | undefined = request.user;
    if (!user) {
      return false;
    }

    const userPermissions: string[] = request.userPermissions ?? [];
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}

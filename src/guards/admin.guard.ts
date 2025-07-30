import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      throw new UnauthorizedException('Authentication required');
    }
    return request.currentUser.admin;
  }
}

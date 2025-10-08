import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class JwtRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token)
      throw new UnauthorizedException('Invalid authorization header format');

    try {
      const decoded = this.jwtService.verify<{
        userId: number;
        email: string;
        iat?: number;
        exp?: number;
      }>(token);

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) throw new UnauthorizedException('User not found');

      const userRoles = Array.isArray(user.role) ? user.role : [user.role];

      if (!roles || roles.length === 0) {
        request['InfUser'] = user;
        return true;
      }

      const hasRole = roles.some((role) =>
        userRoles.includes(role as UserRole),
      );
      if (!hasRole)
        throw new UnauthorizedException(
          'You do not have permission to access this resource',
        );

      if (user.passwordChangeAt) {
        const passwordChangeAt = Math.floor(
          user.passwordChangeAt.getTime() / 1000,
        );
        if (decoded.iat && decoded.iat < passwordChangeAt) {
          throw new UnauthorizedException(
            'Password has been changed, please log in again',
          );
        }
      }

      if (user.isActive === false)
        throw new UnauthorizedException('User is inactive');

      request['InfUser'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error || 'Unauthorized');
    }
  }
}

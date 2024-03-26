import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';  
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { AdminUserType } from 'src/adminuser/adminuser.schema';
import { AdminUserService } from 'src/adminuser/adminuser.service';
  
  @Injectable()
  export class AdminUserTypeGuard implements CanActivate {
    constructor(private readonly adminUserService: AdminUserService) {}
  
    async canActivate(context: ExecutionContext) {
      try {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.sub;
  
        if (!userId) return false;
  
        const user = await this.adminUserService.findById(userId);
  
        if (!user) throw new BadRequestException('User Does not exist');
        if ((user.userType !=  AdminUserType.SuperAdmin) )
          throw new UnauthorizedException(
            'Unauthorized Access',
          );
        return true;
      } catch (error) {
        if (
          error instanceof ForbiddenException ||
          error instanceof BadRequestException
        )
          rethrow(error);
        console.error('Error in AdminUserTypeGuard:', error);
        return false;
      }
    }
  }
  
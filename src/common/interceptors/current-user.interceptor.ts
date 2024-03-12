import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { AdminUserService } from '../../adminuser/adminuser.service';
  
  @Injectable()
  export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private readonly adminUserService: AdminUserService) {}
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
      const request = context.switchToHttp().getRequest();
      const userId = request.user['sub'] || '';
  
      if (userId) {
        const user = await this.adminUserService.findById(userId);
        request.currentuser = user;
      }
  
      return next.handle();
    }
  }
  
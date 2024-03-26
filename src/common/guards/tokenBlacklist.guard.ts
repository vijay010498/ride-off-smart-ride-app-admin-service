import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminUserService } from '../../adminuser/adminuser.service';

@Injectable()
export class TokenBlacklistGuard implements CanActivate {
  constructor(private readonly adminUserService: AdminUserService) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const accessToken = request.user?.accessToken;

      if (!accessToken) return false;

      const tokenInBlackList =
        await this.adminUserService.tokenInBlackList(accessToken);

      if (tokenInBlackList) return false;
      return true;
    } catch (error) {
      console.error('Error in TokenBlacklistGuard:', error);
      return false;
    }
  }
}

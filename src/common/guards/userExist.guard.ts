import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';

export class UserExistGuard implements CanActivate {
  private readonly logger = new Logger(UserExistGuard.name);
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const { id: userId } = request.params;

      if (!userId) {
        throw new BadRequestException(':id is required');
      }
      const user = await this.userService.findById(userId);
      if (!user) throw new NotFoundException('User not found');
      return true;
    } catch (error) {
      this.logger.error('error in UserExistGuard', error);
      return false;
    }
  }
}

import {
  Controller,
  Patch,
  Get,
  Query,
  ParseIntPipe,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUserInterceptor } from 'src/common/interceptors/current-user.interceptor';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IsBlockedGuard } from 'src/common/guards/isBlocked.guard';
import { TokenBlacklistGuard } from 'src/common/guards/tokenBlacklist.guard';
import { AdminUserTypeGuard } from 'src/common/guards/adminusertype.guard';

@Controller('ride/user')
// TODO
@UseInterceptors(CurrentUserInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard, AdminUserTypeGuard)
  getUsers(@Query('page') page: number, @Query('limit') limit: number) {
    return this.userService.getUsers(page, limit);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id/unblock')
  unblockUser(@Param('id') id: string) {
    return this.userService.unblockUser(id);
  }

  @Patch(':id/block')
  blockUser(@Param('id') id: string) {
    return this.userService.blockUser(id);
  }

  // TODO implement one single endpoint for search user where we can search on any user attribute
}

import {
  Controller,
  Patch,
  Get,
  Query,
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
import { SearchRideUserDto } from './dtos/search-ride-user.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';



@ApiBearerAuth()
@ApiTags('Ride User')
@ApiForbiddenResponse({
  description: 'User is blocked',
})
@ApiUnauthorizedResponse({
  description: 'Invalid Token',
})
@ApiBadRequestResponse({
  description: 'User Does not exist',
})
@Controller('ride/user')
// TODO
@UseInterceptors(CurrentUserInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard, AdminUserTypeGuard)
  getUsers(@Query('page') page: number, @Query('limit') limit: number) {
    return this.userService.getRideUsers(page, limit);
  }

  @Patch(':id/unblock')
  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard, AdminUserTypeGuard)
  unblockUser(@Param('id') id: string) {
    return this.userService.unblockRideUser(id);
  }

  @Patch(':id/block')
  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard, AdminUserTypeGuard)
  blockUser(@Param('id') id: string) {
    return this.userService.blockRideUser(id);
  }

  @Get('search')
    @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard, AdminUserTypeGuard)
    async searchRideUsers(@Query() searchDto: SearchRideUserDto, @Query('page') page: number, @Query('limit') limit: number) {
        return this.userService.searchRideUsers(searchDto, page, limit);
    }
}

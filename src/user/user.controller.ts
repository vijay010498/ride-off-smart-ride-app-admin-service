import {
  Controller,
  Patch,
  Get,
  Query,
  ParseIntPipe,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserExistGuard } from '../common/guards/userExist.guard';

@Controller('user')
// TODO
// Implement guards for Admin User
// Implement interceptors for the Admin User
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.userService.getUsers(page, limit);
  }

  @UseGuards(UserExistGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UseGuards(UserExistGuard)
  @Patch(':id/unblock')
  unblockUser(@Param('id') id: string) {
    return this.userService.unblockUser(id);
  }

  @UseGuards(UserExistGuard)
  @Patch(':id/block')
  blockUser(@Param('id') id: string) {
    return this.userService.blockUser(id);
  }

  // TODO implement one single endpoint for search user where we can search on any user attribute
}

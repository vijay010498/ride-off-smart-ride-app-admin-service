import {
  Controller,
  Logger,
  Patch,
  Get,
  Query,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
// TODO
// Implement guards for Admin User
// Implement interceptors for the Admin User
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
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

  //Implement SNS for this Implementation inside the service
  @Patch(':id/block')
  blockUser(@Param('id') id: string) {
    return this.userService.blockUser(id);
  }

  // TODO implement one single endpoint for search user where we can search on any user attribute
}

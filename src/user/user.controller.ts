import {
    BadRequestException,
    Controller,
    Logger,
    Patch,
    Get,
    Query,
    ParseIntPipe,
    NotFoundException,
    Param,
    Post,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  
  @Controller('user')
  // TO DO : 
  // Implement (AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard) for Admin User
  // Implement interceptors for the Admin User
  export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers(
      @Query('page', ParseIntPipe) page: number,
      @Query('limit', ParseIntPipe) limit: number,
    ) {
      const users = await this.userService.getUsers(page, limit);
      return users;
    }

    @Get(':id')
    async getUserDetails(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
    }
    
     //Implement SNS for this Implementation inside the service
    @Patch(':id/unblock')
    async unblockUser(@Param('id') id: string) {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.isBlocked) {
        return { message: 'User is already unblocked' };
      }

      const updatedUser = await this.userService.updateUser(id, { isBlocked: false });
      return updatedUser;
    }

    //Implement SNS for this Implementation inside the service
    @Patch(':id/block')
    async blockUser(@Param('id') id: string) {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isBlocked) {
        return { message: 'User is already blocked' };
      }

      const updatedUser = await this.userService.updateUser(id, { isBlocked: true });
      return updatedUser;
    }

    @Get(':phoneNumber')
    async getUserByPhoneNumber(@Param('phoneNumber') phoneNumber: string) {
      const user = await this.userService.getUserByPhone(phoneNumber);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }
  }
  
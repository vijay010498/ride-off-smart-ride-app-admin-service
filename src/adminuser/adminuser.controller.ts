import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UnauthorizedException,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AdminUserService } from './adminuser.service';
import { CreateAdminUserDto } from './dtos/create-adminuser.dto';
import { UpdateAdminUserDto } from './dtos/update-adminuser.dto';
import { PasswordDto } from './dtos/password.dto';
import { SearchAdminUserDto } from './dtos/search-adminuser.dto';
import { LoginDto } from './dtos/login.dto';
import { CurrentUserInterceptor } from 'src/common/interceptors/current-user.interceptor';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IsBlockedGuard } from '../common/guards/isBlocked.guard';
import { TokenBlacklistGuard } from 'src/common/guards/tokenBlacklist.guard';
import { AdminUserTypeGuard } from 'src/common/guards/adminusertype.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AdminUserTokensDto } from 'src/common/dtos/adminuser-tokens.dto';
import { UserTokens } from 'src/common/decorators/user-token.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Admin User')
@ApiForbiddenResponse({
  description: 'User is blocked',
})
@ApiUnauthorizedResponse({
  description: 'Invalid Token',
})
@ApiBadRequestResponse({
  description: 'User Does not exist',
})
@Controller('admin/user')
@UseInterceptors(CurrentUserInterceptor)
export class AdminuserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post()
  @UseGuards(
    AccessTokenGuard,
    IsBlockedGuard,
    TokenBlacklistGuard,
    AdminUserTypeGuard,
  )
  async createAdminUser(@Body() createAdminDto: CreateAdminUserDto) {
    return this.adminUserService.createAdminUser(createAdminDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return this.adminUserService.login(loginDto.email, loginDto.password);
    } catch (error) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  @Get('logout')
  @UseGuards(
    AccessTokenGuard,
    IsBlockedGuard,
    TokenBlacklistGuard,
    AdminUserTypeGuard,
  )
  async logout(
    @CurrentUser() user: any,
    @UserTokens() tokens: Partial<AdminUserTokensDto>,
  ) {
    return this.adminUserService.logout(user.id, tokens.accessToken);
  }

  @Get()
  @UseGuards(
    AccessTokenGuard,
    IsBlockedGuard,
    TokenBlacklistGuard,
    AdminUserTypeGuard,
  )
  async getAllAdminUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.adminUserService.getAllAdminUsers(page, limit);
  }

  @Patch(':id/update-user')
  @UseGuards(
    AccessTokenGuard,
    IsBlockedGuard,
    TokenBlacklistGuard,
    AdminUserTypeGuard,
  )
  async updateAdminUser(
    @Param('id') userId: string,
    @Body() updateAdminDto: any,
  ) {
    return this.adminUserService.updateAdminUser(userId, updateAdminDto);
  }

  @Patch(':id/password')
  @UseGuards(
    AccessTokenGuard,
    IsBlockedGuard,
    TokenBlacklistGuard,
    AdminUserTypeGuard,
  )
  async updatePassword(
    @Param('id') userId: string,
    @Body() updatePasswordDto: PasswordDto,
  ) {
    return this.adminUserService.updatePassword(userId, updatePasswordDto);
  }

  @Get('search')
  @UseGuards(
    AccessTokenGuard,
    IsBlockedGuard,
    TokenBlacklistGuard,
    AdminUserTypeGuard,
  )
  async searchAdminUsers(
    @Query() searchDto: SearchAdminUserDto,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.adminUserService.searchAdminUsers(searchDto, page, limit);
  }

  @Post(':id/reset-password')
  @UseGuards(
    AccessTokenGuard,
    IsBlockedGuard,
    TokenBlacklistGuard,
    AdminUserTypeGuard,
  )
  async resetPassword(@Param('id') userId: string) {
    return this.adminUserService.resetPassword(userId);
  }
}

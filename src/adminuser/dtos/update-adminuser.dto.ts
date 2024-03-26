import { ApiProperty } from '@nestjs/swagger';
import { AdminUserType } from '../adminuser.schema';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdminUserDto {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  userType?: AdminUserType;

  @ApiProperty()
  isBlocked?: boolean;

  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  refreshToken: string;
}

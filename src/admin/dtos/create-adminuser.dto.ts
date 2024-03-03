import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../adminuser.schema';



export class CreateAdminUserDto  {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  userType: UserType;

  @ApiProperty()
  @IsBoolean()
  isBlocked: Boolean;
}

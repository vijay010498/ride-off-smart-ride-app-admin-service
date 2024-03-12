import { ApiProperty } from "@nestjs/swagger";
import { AdminUserType } from "../adminuser.schema";
import { IsString } from "class-validator";

export class UpdateAdminUserDto {
    @ApiProperty()
    firstName?: string;

    @ApiProperty()
    lastName?: string;

    @ApiProperty()
    userType?: AdminUserType;

    @ApiProperty()
    isBlocked?: Boolean;

    @IsString()
    refreshToken: string;
}
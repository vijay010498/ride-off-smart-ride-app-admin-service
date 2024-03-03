import { ApiProperty } from "@nestjs/swagger";
import { UserType } from "../adminuser.schema";

export class UpdateAdminUserDto {
    @ApiProperty()
    firstName?: string;

    @ApiProperty()
    lastName?: string;

    @ApiProperty()
    userType?: UserType;

    @ApiProperty()
    isBlocked?: Boolean;
}
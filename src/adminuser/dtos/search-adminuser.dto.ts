import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, isBoolean } from "class-validator";


export class SearchAdminUserDto {

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    userType?: string;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    isBlocked?: boolean;

}
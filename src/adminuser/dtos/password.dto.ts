import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PasswordDto  {
    @ApiProperty()
    @IsString()
    currentPassword: string; 
    
    @ApiProperty()
    @IsString()
    newPassword: string;
}

export class PasswordResponseDto{
    message : string;

    constructor(response: PasswordResponseDto) {
        Object.assign(this, response);
    }
}
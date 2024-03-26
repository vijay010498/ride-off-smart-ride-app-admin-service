import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;
    
    @ApiProperty()
    @IsString()
    password: string;
}

export class LoginResponseDto{
    message : string;
    accessToken : string;
    refreshToken : string;
    id : string;

    constructor(response: LoginResponseDto) {
        Object.assign(this, response);
    }
}
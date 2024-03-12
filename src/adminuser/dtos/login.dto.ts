export class LoginDto {
    email: string;
    password: string;
}

export class LoginResponseDto{
    message : string;
    accessToken : string;
    refreshToken : string;

    constructor(response: LoginResponseDto) {
        Object.assign(this, response);
    }
}
import { IsString } from 'class-validator';

export class UserTokensDto {
  @IsString()
  requestRefreshToken: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}

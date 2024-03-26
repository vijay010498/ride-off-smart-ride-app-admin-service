import { IsString } from 'class-validator';

export class AdminUserTokensDto {
  @IsString()
  requestRefreshToken: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
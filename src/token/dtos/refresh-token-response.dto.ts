import { ApiProperty } from '@nestjs/swagger';
export class RefreshTokenResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  constructor(response: RefreshTokenResponseDto) {
    Object.assign(this, response);
  }
}

import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { MyConfigService } from '../my-config/my-config.service';
  import * as argon2 from 'argon2';
  import { AdminUserService } from '../adminuser/adminuser.service';
  import { RefreshTokenResponseDto } from './dtos/refresh-token-response.dto';
  @Injectable()
  export class TokenService {
    private logger = new Logger(TokenService.name);
    constructor(
      private readonly jwtService: JwtService,
      private readonly configService: MyConfigService,
      private readonly adminUserService: AdminUserService,
    ) {}
  
    private hashData(data: string) {
      return argon2.hash(data);
    }
  
    async refreshTokens(adminUser: any, requestRefreshToken: string) {
      try {
        if (!adminUser.refreshToken)
          throw new ForbiddenException('Please Login First');
        const refreshTokenMatches = await argon2.verify(
          adminUser.refreshToken,
          requestRefreshToken,
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const { accessToken, refreshToken } = await this.getTokens(
            adminUser.id,
            adminUser.email,
        );
        await this.updateRefreshToken(adminUser.id, refreshToken);
        return new RefreshTokenResponseDto({
          accessToken,
          refreshToken,
        });
      } catch (error) {
        this.logger.error('refreshTokens-service-error', error);
        if (error instanceof ForbiddenException) {
          throw error;
        }
        throw new InternalServerErrorException('Server Error');
      }
    }
  
    async updateRefreshToken(userId: string, refreshToken: string) {
      const hashedRefreshToken = await this.hashData(refreshToken);
      return this.adminUserService.updateRefreshToken(userId, hashedRefreshToken);
    }


    async getTokens(email: string, password: string) {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { sub: email, password },
          {
            secret: this.configService.getJwtAccessSecret(),
            expiresIn: '30d',
          },
        ),
        this.jwtService.signAsync(
          { sub: email, password },
          {
            secret: this.configService.getJwtRefreshSecret(),
            expiresIn: '150d',
          },
        ),
      ]);
      return {
        accessToken,
        refreshToken,
      };
    }
  }
  
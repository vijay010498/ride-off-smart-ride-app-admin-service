import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminuserModule } from 'src/adminuser/adminuser.module';
import { MyConfigModule } from 'src/my-config/my-config.module';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
    imports: [MyConfigModule, JwtModule.register({}), AdminuserModule],
    controllers:[TokenController],
    providers:[TokenService, AccessTokenStrategy, RefreshTokenStrategy],
    exports: [TokenService],
})
export class TokenModule {}

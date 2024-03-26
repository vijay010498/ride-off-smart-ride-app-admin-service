import { Module, forwardRef } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { MyConfigModule } from '../my-config/my-config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserSchema } from '../adminuser/adminuser.schema';
import { AdminUserTokenBlacklistSchema } from '../adminuser/adminuser-token-blacklist.schema';
import { AdminuserModule } from 'src/adminuser/adminuser.module';



@Module({
    imports: [
        MyConfigModule, 
        JwtModule.register({}), 
        MongooseModule.forFeature([
            {
                name: 'AdminUser',
                schema:AdminUserSchema
            },
            {
                name: 'AdminUserTokenBlacklist',
                schema: AdminUserTokenBlacklistSchema,
              },
        ]),
        forwardRef(() => AdminuserModule)
    ],
    controllers:[TokenController],
    providers:[TokenService, AccessTokenStrategy, RefreshTokenStrategy],
    exports: [TokenService],
})
export class TokenModule {}





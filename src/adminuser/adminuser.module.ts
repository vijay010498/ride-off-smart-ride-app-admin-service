import { Module } from '@nestjs/common';
import { AdminuserController } from './adminuser.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUser, AdminUserSchema } from './adminuser.schema';
import { AdminUserTokenBlacklist, AdminUserTokenBlacklistSchema } from './adminuser-token-blacklist.schema';
import { AdminUserService } from './adminuser.service';
import { UserInitService } from './userinitservice.service';
import { TokenModule } from '../token/token.module';
import { EmailModule } from '../email_processor/email.module';
@Module({
imports: [
    MongooseModule.forFeature([
        {
        name: AdminUser.name,
        schema: AdminUserSchema,
        },
        {
        name: AdminUserTokenBlacklist.name,
        schema: AdminUserTokenBlacklistSchema,
        },
    ]),
    EmailModule,
    TokenModule
    ],
  controllers: [AdminuserController],
  providers: [AdminUserService, UserInitService],
  exports: [AdminUserService],
})
export class AdminuserModule {}

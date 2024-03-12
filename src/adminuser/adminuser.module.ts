import { Module } from '@nestjs/common';
import { AdminuserController } from './adminuser.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserSchema } from './adminuser.schema';
import { AdminUserTokenBlacklistSchema } from './adminuser-token-blacklist.schema';
import { AdminUserService } from './adminuser.service';
import { UserInitService } from './userinitservice.service';
@Module({
imports: [
    MongooseModule.forFeature([
        {
        name: 'AdminUser',
        schema: AdminUserSchema,
        },
        {
        name: 'AdminUserTokenBlacklist',
        schema: AdminUserTokenBlacklistSchema,
        },
    ]),
    ],
  controllers: [AdminuserController],
  providers: [AdminUserService, UserInitService],
  exports: [AdminUserService],
})
export class AdminuserModule {}

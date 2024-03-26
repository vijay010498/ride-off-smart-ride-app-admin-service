// superuser.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { AdminUser, AdminUserDocument } from './adminuser.schema';
import { CreateAdminUserDto } from './dtos/create-adminuser.dto';
import { AdminUserType } from './adminuser.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminUserService } from './adminuser.service';

@Injectable()
export class UserInitService implements OnModuleInit {
  constructor(
    @InjectModel(AdminUser.name) private readonly adminModel: Model<AdminUserDocument>,
    private readonly adminUserService: AdminUserService ) {}

  async createSuperuserIfNotExists(){
    const superuserExists = await this.adminModel.find({ userType: 'Super-Admin' });

    if (!superuserExists) {
      const createAdminDto: CreateAdminUserDto = {
          email: 'kenmbano@hotmail.com',
          firstName: 'Super',
          lastName: 'User',
          userType: AdminUserType.SuperAdmin,
      };

      try {
        await this.adminUserService.createAdminUser(createAdminDto);
      } catch (error) {
        // Handle errors if necessary
        console.error('Failed to create superuser:', error);
      }
    }
  }

  async onModuleInit() {
    await this.createSuperuserIfNotExists();
  }
}

import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './adminuser.schema';
import { CreateAdminUserDto } from './dtos/create-adminuser.dto';
import {SendmailService} from '../common/services/sendemail.service';
import * as bcrypt from 'bcrypt';
import { UpdateAdminUserDto } from './dtos/update-adminuser.dto';
import { PasswordDto } from './dtos/password.dto';
import { AdminResponseDto } from './dtos/admin-response.dto';


export class AdminService {
    constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>, private readonly sendmailService: SendmailService) {}
  
    async createAdmin(createAdminDto: CreateAdminUserDto): Promise<Admin> {
      const { email, firstName, lastName, userType } = createAdminDto;
  
      if (!email || !firstName || !lastName || !userType) {
        throw new BadRequestException('Missing required fields in CreateAdminUserDto');
      }
  
      const existingAdmin = await this.adminModel.findOne({ email });
      if (existingAdmin) {
        throw new BadRequestException('Email already exists');
      }
  
      const saltRounds = 10; 
      const plainPassword = this.generatePassword();
      const hashedPassword = await this.hashPassword(plainPassword, saltRounds);
  
      try {
        const newAdmin = new this.adminModel({
          email,
          firstName,
          lastName,
          userType,
          firstTimeLogin: true,
          hashedPassword,
        });
  
        await newAdmin.save();
        let notificationMessage = "Welcome" + firstName +", The Password to your newly created account is :"+ + plainPassword;
        await this.sendmailService.sendEmail(email, notificationMessage, "Account Creation" );
        return newAdmin;
      } catch (err) {
        throw new InternalServerErrorException('Failed to create admin user', err);
      }
    }

    async login(email: string, password: string): Promise<Admin> {
        const admin = await this.adminModel.findOne({ email });
    
        if (!admin) {
          throw new UnauthorizedException('Invalid email or password');
        }
    
        const isPasswordValid = bcrypt.compareSync(password, admin.hashedPassword); // Compare hashed passwords securely
    
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid email or password');
        }
    
        return admin; // Return admin object (consider excluding sensitive data and using a dedicated login response DTO for security)
    }

    async updateAdmin(userId: string, updateAdminDto: UpdateAdminUserDto): Promise<Admin> {
        const existingAdmin = await this.adminModel.findByIdAndUpdate(userId, updateAdminDto, {
          new: true, // Return the updated document
          runValidators: true, // Validate the updated data
        });
    
        if (!existingAdmin) {
          throw new BadRequestException(`Admin with ID '${userId}' not found`);
        }
    
        return existingAdmin;
    }

    async updatePassword(userId: string, updatePasswordDto: PasswordDto): Promise<void> {
        const admin = await this.adminModel.findById(userId);
      
        if (!admin) {
          throw new UnauthorizedException('Invalid user');
        }
      
        const isPasswordValid = bcrypt.compareSync(updatePasswordDto.currentPassword, admin.hashedPassword);
      
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid current password');
        }
      
        const newHashedPassword = bcrypt.hashSync(updatePasswordDto.newPassword, 10); // Use a suitable salt rounds value
      
        const update = {
          hashedPassword: newHashedPassword,
          firstTimeLogin: false, // Update firstTimeLogin to false only if it was previously true
        };
      
        // Check if firstTimeLogin is true before updating
        if (admin.firstTimeLogin) {
          await this.adminModel.findByIdAndUpdate(userId, update);
        } else {
          // If not first time login, only update password
          await this.adminModel.findByIdAndUpdate(userId, { hashedPassword: newHashedPassword });
        }
      
        return; // Consider returning a success message instead of void, but avoid sending sensitive information
    }

    async getAllUsers(page: number = 1, limit: number = 10): Promise<AdminResponseDto[]> {
        const skip = (page - 1) * limit;
        const users = await this.adminModel.find({}).skip(skip).limit(limit).sort({ _id: 'asc' });
        const userDtos: AdminResponseDto[] = users.map((user) => ({
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          isBlocked: user.isEnabled
        }));
      
        return userDtos  
    }
    
    


  
    private async hashPassword(password: string, saltRounds: number): Promise<string> {
      return await bcrypt.hash(password, saltRounds);
    }
  
    private generatePassword(length = 12): string {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  
    
  }
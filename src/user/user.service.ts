import {
    Injectable,
    Logger,
  } from '@nestjs/common';
  import { Model } from 'mongoose';
  import { UserDocument } from './user.schema';
  import { UserTokenBlacklistDocument } from './user-token-blacklist.schema';
  import { InjectModel } from '@nestjs/mongoose';
  
  @Injectable()
  export class UserService {
    constructor(
      @InjectModel('User') private readonly userCollection: Model<UserDocument>,
      @InjectModel('UserTokenBlacklist')
      private readonly UserTokenBlacklistCollection: Model<UserTokenBlacklistDocument>,
    ) {}
  
    async getUserByPhone(phoneNumber: string) {
      const user = await this.userCollection.findOne({
        phoneNumber,
      });
      return user;
    }
  
    async createUserByPhone(userObject: any, userId: string) {
      try {
        // check if user already exists
        const existingUser = await this.findById(userId);
        if (existingUser) throw new Error('User With Given Id already exists');
        const user = new this.userCollection({ ...userObject });
        await user.save();
  
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    async findById(id: string) {
      return this.userCollection.findById(id);
    }

    async getUsers(page: number = 1, limit: number = 50) {
        const skip = (page - 1) * limit;
        const users = await this.userCollection.find().skip(skip).limit(limit).exec();
        return users;
    }
  
    private async _update(id: string, updateUserDto: any) {
      return this.userCollection
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
    }
  
    async tokenInBlackList(accessToken: string) {
      return this.UserTokenBlacklistCollection.findOne({
        token: accessToken,
      });
    }
  
    async addTokenInBlackList(accessToken: string) {
      const blackListToken = new this.UserTokenBlacklistCollection({
        token: accessToken,
      });
      return blackListToken.save();
    }
  
    async updateUser(userId: string, updateDto: any) {
      return this._update(userId, updateDto);
    }
    
  }
  
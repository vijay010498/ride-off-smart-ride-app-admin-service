import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginatedDataDto } from 'src/common/dtos/paginated-data.dto';
import { SearchRideUserDto } from './dtos/search-ride-user.dto';
import { SnsService } from 'src/sns/sns.service';

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel('User') private readonly userCollection: Model<UserDocument>,
    private readonly snsService: SnsService,
  ) {}


  async searchRideUsers(searchDto: SearchRideUserDto, page: number = 1, limit: number = 10){
    const skip = (page - 1) * limit;

    const searchQuery: { [key: string]: any } = {};

    if (searchDto.firstName) {
      searchQuery.firstName = { $regex: searchDto.firstName, $options: 'i' };
    }
    if (searchDto.lastName) {
      searchQuery.lastName = { $regex: searchDto.lastName, $options: 'i' };
    }
    if (searchDto.phoneNumber) {
      searchQuery.phoneNumber = searchDto.phoneNumber;
    }
    if (searchDto.email) {
      searchQuery.email = searchDto.email;
    }
    if (searchDto.isBlocked !== undefined) {
      searchQuery.isBlocked = searchDto.isBlocked;
    }

    const [users, totalUsers] = await Promise.all([
      this.userCollection.find(searchQuery, { hashedPassword: 0 }).skip(skip).limit(limit).sort({ _id: 'asc' }),
      this.userCollection.countDocuments(searchQuery),
    ]);

    const paginatedData: PaginatedDataDto = {
      data: users.map((user) => ({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isBlocked: user.isBlocked,
        phoneNumber: user.phoneNumber,
        lastLocation : user.lastLocation
      })),
      total: totalUsers,
      page,
      limit,
    };

    return paginatedData;
  }

  async getRideUsers(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [users, totalUsers] = await Promise.all([
      this.userCollection.find({}).skip(skip).limit(limit).sort({ _id: 'asc' }),
      this.userCollection.countDocuments()]);

    const paginatedData: PaginatedDataDto = {
      data: users.map((user) => ({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isBlocked: user.isBlocked,
        phoneNumber: user.phoneNumber,
        lastLocation : user.lastLocation
      })),
      total: totalUsers,
      page,
      limit,
    };

    return paginatedData;
  }

  async updateUser(userId: string, updateDto: any) {
    return this._update(userId, updateDto);
  }

  async unblockRideUser(userId: string) {
    const user = await this._update(userId, {
      isBlocked: false,
    });

    this.snsService.userUpdatedEvent(user);

    const response = {
      message : "success"
    }

    return response;
  }

  async blockRideUser(userId: string) {
    const user = await this._update(userId, {
      isBlocked: true,
    });

    this.snsService.userUpdatedEvent(user);

    const response = {
      message : "success"
    }
    
    return response; 
  }

  private async _update(id: string, updateUserDto: any) {
    return this.userCollection
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
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
}

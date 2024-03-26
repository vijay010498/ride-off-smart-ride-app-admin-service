import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RideUserResponseDto } from './dtos/ride-user-response.dto';
import { PaginatedDataDto } from 'src/common/dtos/paginated-data.dto';
import { SearchRideUserDto } from './dtos/search-ride-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userCollection: Model<UserDocument>,
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
    // send SNS event - to admin topic SNS
    return await this._update(userId, {
      isBlocked: false,
    });
  }

  async blockRideUser(userId: string) {
    // send SNS event - to admin topic SNS
    return this._update(userId, {
      isBlocked: true,
    });
  }


  private async _update(id: string, updateUserDto: any) {
    return this.userCollection
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }
}

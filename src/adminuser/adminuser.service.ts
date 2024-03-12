import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminUser, AdminUserDocument } from './adminuser.schema';
import { CreateAdminUserDto } from './dtos/create-adminuser.dto';
import { SendmailService } from '../common/services/sendemail.service';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { UpdateAdminUserDto } from './dtos/update-adminuser.dto';
import { PasswordDto } from './dtos/password.dto';
import { SearchAdminUserDto } from './dtos/search-adminuser.dto';
import { PaginatedDataDto } from 'src/common/dtos/paginated-data.dto';
import { AdminUserTokensDto } from 'src/common/dtos/adminuser-tokens.dto';
import { LoginResponseDto } from './dtos/login.dto';
import { AdminUserTokenBlacklistDocument } from './adminuser-token-blacklist.schema';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectModel(AdminUser.name) private readonly adminModel: Model<AdminUserDocument>,
    private readonly AdminUserTokenBlacklistCollection: Model<AdminUserTokenBlacklistDocument>,
    private readonly sendmailService: SendmailService,
    private readonly tokenService: TokenService) { }

  async createAdminUser(createAdminDto: CreateAdminUserDto): Promise<AdminUser> {
    const { email, firstName, lastName, userType, isBlocked } = createAdminDto;

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
        isBlocked
      });

      await newAdmin.save();
      let notificationMessage = "Welcome" + firstName + ", The Password to your newly created account is :" + + plainPassword;
      await this.sendmailService.sendEmail(email, notificationMessage, "Account Creation");
      return newAdmin;
    } catch (err) {
      throw new InternalServerErrorException('Failed to create admin user', err);
    }
  }

  async login(email: string, password: string) {
    const admin = await this.adminModel.findOne({ email });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = bcrypt.compareSync(password, admin.hashedPassword); // Compare hashed passwords securely

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { accessToken, refreshToken } = await this.tokenService.getTokens(
      admin.id,
      admin.email,
    );

    await this.tokenService.updateRefreshToken(admin.id, refreshToken);

    return new LoginResponseDto({
      message: 'Success',
      accessToken,
      refreshToken,
    });

    
  }

  async logout(userId: string, accessToken: string) {
    await this._update(userId, { refreshToken: null });
    const blackListToken = new this.AdminUserTokenBlacklistCollection({
      token: accessToken,
    });

    await blackListToken.save();
  }

  async findById(id: string) {
    return this.adminModel.findById(id);
  }

  async updateAdminUser(userId: string, updateAdminDto: UpdateAdminUserDto): Promise<AdminUser> {
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

  async getAllAdminUsers(page: number = 1, limit: number = 10): Promise<PaginatedDataDto> {
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      this.adminModel.find({}).skip(skip).limit(limit).sort({ _id: 'asc' }),
      this.adminModel.countDocuments()]);

    const paginatedData: PaginatedDataDto = {
      data: users.map((user) => ({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        isBlocked: user.isEnabled,
      })),
      total: totalUsers,
      page,
      limit,
    };

    return paginatedData;
  }

  async searchAdminUsers(searchDto: SearchAdminUserDto, page: number = 1, limit: number = 10): Promise<PaginatedDataDto> {
    const skip = (page - 1) * limit;

    const searchQuery: { [key: string]: any } = {};

    if (searchDto.firstName) {
      searchQuery.firstName = { $regex: searchDto.firstName, $options: 'i' };
    }
    if (searchDto.lastName) {
      searchQuery.lastName = { $regex: searchDto.lastName, $options: 'i' };
    }
    if (searchDto.userType) {
      searchQuery.userType = searchDto.userType;
    }
    if (searchDto.isBlocked !== undefined) {
      searchQuery.isBlocked = searchDto.isBlocked;
    }

    const [users, totalUsers] = await Promise.all([
      this.adminModel.find(searchQuery, { hashedPassword: 0 }).skip(skip).limit(limit).sort({ _id: 'asc' }),
      this.adminModel.countDocuments(searchQuery),
    ]);

    const paginatedData: PaginatedDataDto = {
      data: users.map((user) => ({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        isBlocked: user.isEnabled,
      })),
      total: totalUsers,
      page,
      limit,
    };

    return paginatedData;
  }

  async resetPassword(userId: string): Promise<void> {
    const admin = await this.adminModel.findById(userId);

    if (!admin) {
      throw new UnauthorizedException('Invalid user');
    }

    // Generate a new password
    const newPassword = this.generatePassword();
    const hashedPassword = await this.hashPassword(newPassword, 10);

    // Update user's password and first time login status
    await this.adminModel.findByIdAndUpdate(userId, { hashedPassword, firstTimeLogin: true });

    // Send email with the new password
    const emailMessage = `Your password has been reset. Your new password is: ${newPassword}`;
    await this.sendmailService.sendEmail(admin.email, emailMessage, 'Password Reset');
  }

  async enableAdminUser(userId: string): Promise<void> {
    const admin = await this.adminModel.findById(userId);

    if (!admin) {
      throw new UnauthorizedException('Invalid user');
    }

    // Update user's status to enabled
    await this.adminModel.findByIdAndUpdate(userId, { isEnabled: true });
  }

  async disableAdminUser(userId: string): Promise<void> {
    const admin = await this.adminModel.findById(userId);

    if (!admin) {
      throw new UnauthorizedException('Invalid user');
    }

    // Update user's status to disabled
    await this.adminModel.findByIdAndUpdate(userId, { isEnabled: false });
  }

  async updateRefreshToken(userId: string, refreshToken: string = null) {
    return this._update(userId, { refreshToken });
  }

  async tokenInBlackList(accessToken: string) {
    const tokenInBlackList = await this.AdminUserTokenBlacklistCollection.findOne({
      token: accessToken,
    });
    return tokenInBlackList;
  }

  private async _update(
    id: string,
    updateAdminUserDto:
      | AdminUserTokensDto
      | UpdateAdminUserDto
      | Partial<UpdateAdminUserDto>
  ) {
    return this.adminModel
      .findByIdAndUpdate(id, updateAdminUserDto, { new: true })
      .exec();
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
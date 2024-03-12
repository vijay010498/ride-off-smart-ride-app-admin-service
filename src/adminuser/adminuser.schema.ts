import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AdminUserType {
    SuperAdmin = 'Super-Admin',
    StandardAdmin = 'Standard-Admin',
  }

@Schema()
export class AdminUser extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: AdminUserType })
  userType: AdminUserType;

  @Prop({ default: true })
  firstTimeLogin: boolean;

  @Prop({ default: true })
  isEnabled: boolean;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop()
  refreshToken: string;
}

export type AdminUserDocument = AdminUser & Document;
export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
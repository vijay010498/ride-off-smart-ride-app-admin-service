import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserType {
    SuperAdmin = 'Super-Admin',
    Admin = 'Admin',
    StandardAdmin = 'Standard-Admin',
  }

@Schema()
export class Admin extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: UserType })
  userType: UserType;

  @Prop({ default: true })
  firstTimeLogin: boolean;

  @Prop({ default: true })
  isEnabled: boolean;

  @Prop({ required: true })
  hashedPassword: string;
}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);
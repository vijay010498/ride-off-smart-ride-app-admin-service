import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, id: true })
export class AdminUserTokenBlacklist {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  token: string;
}

export type AdminUserTokenBlacklistDocument = AdminUserTokenBlacklist & Document;
export const AdminUserTokenBlacklistSchema =
  SchemaFactory.createForClass(AdminUserTokenBlacklist);

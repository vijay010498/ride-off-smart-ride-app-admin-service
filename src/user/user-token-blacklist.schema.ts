import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, id: true })
export class UserTokenBlacklist {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  token: string;
}

export type UserTokenBlacklistDocument = UserTokenBlacklist & Document;
export const UserTokenBlacklistSchema =
  SchemaFactory.createForClass(UserTokenBlacklist);

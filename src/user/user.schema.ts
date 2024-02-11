import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export enum GeoJSONType {
  Point = 'Point',
}
interface Location {
  type: GeoJSONType;
  coordinates: [number, number]; // [longitude, latitude]
}

@Schema({ timestamps: true, id: true })
export class User {
  @Prop({
    required: true,
    match: /^\d{3}-\d{3}-\d{4}$/,
    unique: true,
    index: true,
  })
  phoneNumber: string;

  @Prop()
  email: string;

  @Prop({
    default: false,
  })
  signedUp: boolean;

  @Prop({
    default: false,
  })
  isBlocked: boolean;

  @Prop({
    default: false,
  })
  faceIdVerified: boolean;

  @Prop()
  refreshToken: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    type: { type: String, default: GeoJSONType.Point, enum: GeoJSONType }, // GeoJSON type
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  })
  lastLocation: Location;
}

export type UserDocument = User & Document;
const UserSchema = SchemaFactory.createForClass(User);

// Create 2dsphere index for lastLocation
UserSchema.index({ lastLocation: '2dsphere' });

export { UserSchema };

import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum VehicleTypeEnum {
  hatchBack = 'Hatchback',
  coupe = 'Coupe',
  convertible = 'Convertible',
  sedan = 'Sedan',
  suv = 'SUV',
  truck = 'Truck',
  stationWagon = 'Station Wagon',
  minivan = 'Minivan',
  van = 'Van',
}

@Schema({ timestamps: true, id: true })
export class UserVehicle {
  @Prop({
    required: true,
    index: true,
    ref: 'User',
    type: mongoose.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  model: string;

  @Prop({
    required: true,
    type: String,
    index: true,
    enum: VehicleTypeEnum,
  })
  type: VehicleTypeEnum;

  @Prop({
    required: true,
    type: String,
  })
  color: string;

  @Prop({
    required: true,
    type: String,
  })
  year: string;

  @Prop({
    required: true,
    type: String,
  })
  licensePlate: string;

  @Prop({
    required: true,
    type: Number,
  })
  averageKmPerLitre: number;

  @Prop({
    required: true,
    type: [String],
  })
  vehicleImagesS3URIs: string[];

  @Prop({
    required: true,
    type: [String],
  })
  vehicleImagesObjectURLs: string[];
}

export type UserVehicleDocument = UserVehicle & Document;

export const UserVehicleSchema = SchemaFactory.createForClass(UserVehicle);

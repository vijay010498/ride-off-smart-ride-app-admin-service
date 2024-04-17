import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum GeoJSONType {
  Point = 'Point',
}
interface Location {
  type: GeoJSONType;
  coordinates: [number, number]; // [longitude, latitude]
}

export enum RiderRideStatus {
  created = 'RIDE_CREATED',
  cancelled = 'RIDE_CANCELLED',
  booked = 'RIDE_BOOKED_BOOKED',
  started = 'RIDE_STARTED',
  completed = 'RIDE_COMPLETED',
  inProgress = 'RIDE_IN_PROGRESS',
  pendingResponse = 'RIDE_PENDING_RESPONSE',
}

export function parseRiderRideStatus(status: string): RiderRideStatus {
    switch (status.toLowerCase()) {
      case 'RIDE_CREATED':
        return RiderRideStatus.created;
      case 'RIDE_CANCELLED':
        return RiderRideStatus.cancelled;
      case 'RIDE_STARTED':
        return RiderRideStatus.started;
      case 'RIDE_COMPLETED':
        return RiderRideStatus.completed;
      case 'RIDE_IN_PROGRESS':
        return RiderRideStatus.inProgress;
        case 'RIDE_PENDING_RESPONSE':
          return RiderRideStatus.pendingResponse;
      default:
        throw new Error(`Invalid driver ride status: ${status}`);
    }
  }

@Schema({ timestamps: true, id: true })
export class RiderRide {
  @Prop({
    required: true,
    index: true,
    ref: 'User',
    type: mongoose.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: { type: String, default: GeoJSONType.Point, enum: GeoJSONType }, // GeoJSON type
    coordinates: { type: [Number] }, // [longitude, latitude]
  })
  from: Location;

  @Prop({
    type: { type: String, default: GeoJSONType.Point, enum: GeoJSONType }, // GeoJSON type
    coordinates: { type: [Number] }, // [longitude, latitude]
  })
  to: Location;

  @Prop({
    type: String,
    required: true,
  })
  fromAddress: string;

  @Prop({
    type: String,
    required: true,
  })
  toAddress: string;

  @Prop({
    type: String,
    required: true,
  })
  fromPlaceId: string;

  @Prop({
    type: String,
    required: true,
  })
  toPlaceId: string;

  @Prop({
    type: String,
    required: true,
  })
  fromUrl: string;

  @Prop({
    type: String,
    required: true,
  })
  toUrl: string;

  @Prop({
    type: String,
    required: true,
  })
  fromName: string;

  @Prop({
    type: String,
    required: true,
  })
  toName: string;

  @Prop({
    type: String,
    required: false,
  })
  fromPostalCode: string;

  @Prop({
    type: String,
    required: false,
  })
  toPostalCode: string;

  @Prop({
    type: String,
    required: true,
  })
  fromCountryShortName: string;

  @Prop({
    type: String,
    required: true,
  })
  toCountryShortName: string;

  @Prop({
    type: String,
    required: true,
  })
  fromCountryLongName: string;

  @Prop({
    type: String,
    required: true,
  })
  toCountryLongName: string;

  @Prop({
    type: String,
    required: true,
  })
  fromProvinceShortName: string;

  @Prop({
    type: String,
    required: true,
  })
  toProvinceShortName: string;

  @Prop({
    type: String,
    required: true,
  })
  fromProvinceLongName: string;

  @Prop({
    type: String,
    required: true,
  })
  toProvinceLongName: string;

  // should include date and time
  @Prop({
    required: true,
    type: Date,
    index: true,
  })
  departing: Date;

  @Prop({
    required: true,
    type: Number,
  })
  totalRideDurationInSeconds: number;

  @Prop({
    required: true,
    type: Number,
  })
  totalRideDistanceInMeters: number;

  @Prop({
    type: String,
    enum: RiderRideStatus,
    default: RiderRideStatus.created,
  })
  status: string;

  @Prop({
    type: Number,
    required: true,
  })
  seats: number;

  @Prop({
    type: Number,
  })
  maxPrice: number;

  @Prop({
    type: String,
    required: false,
  })
  rideDescription: string;
}

export type RiderRideDocument = RiderRide & Document;
const RiderRideScheme = SchemaFactory.createForClass(RiderRide);

RiderRideScheme.index({
  from: '2dsphere',
  to: '2dsphere',
});

export { RiderRideScheme };

import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum GeoJSONType {
  Point = 'Point',
}
interface Location {
  type: GeoJSONType;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Stop {
  address: string;
  longitude: number;
  latitude: number;
  coordinates: Location;
  url: string;
  name: string;
  postalCode?: string;
  countryShortName: string;
  countryLongName: string;
  provinceShortName: string;
  provinceLongName: string;
  placeId: string;
  arrivalTime: Date;
  distanceFromPrevStopInMeters: number;
  durationFromPrevStopInSeconds: number;
}

export enum DriverRideStatus {
  created = 'RIDE_CREATED',
  cancelled = 'RIDE_CANCELLED',
  full = 'RIDE_BOOKED_FULL',
  started = 'RIDE_STARTED',
  completed = 'RIDE_COMPLETED',
  inProgress = 'RIDE_IN_PROGRESS',
  pendingResponse = 'RIDE_PENDING_RESPONSE',
}

export function parseDriverRideStatus(status: string): DriverRideStatus {
  switch (status.toLowerCase()) {
    case 'RIDE_CREATED':
      return DriverRideStatus.created;
    case 'RIDE_CANCELLED':
      return DriverRideStatus.cancelled;
    case 'RIDE_BOOKED_FULL':
      return DriverRideStatus.full;
    case 'RIDE_STARTED':
      return DriverRideStatus.started;
    case 'RIDE_COMPLETED':
      return DriverRideStatus.completed;
    case 'RIDE_IN_PROGRESS':
      return DriverRideStatus.inProgress;
      case 'RIDE_PENDING_RESPONSE':
        return DriverRideStatus.pendingResponse;
    default:
      throw new Error(`Invalid driver ride status: ${status}`);
  }
}

export enum LuggageEnum {
  noLuggage = 'NoLuggage',
  small = 'Small',
  medium = 'Medium',
  large = 'Large',
}
@Schema({ timestamps: true, id: true })
export class DriverRide {
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
  origin: Location;

  @Prop({
    type: { type: String, default: GeoJSONType.Point, enum: GeoJSONType }, // GeoJSON type
    coordinates: { type: [Number] }, // [longitude, latitude]
  })
  destination: Location;

  @Prop({
    type: [Object],
  })
  stops: Stop[];

  @Prop({
    type: String,
    required: true,
  })
  originAddress: string;

  @Prop({
    type: String,
    required: true,
  })
  destinationAddress: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  originPlaceId: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  destinationPlaceId: string;

  @Prop({
    type: String,
    required: true,
  })
  originUrl: string;

  @Prop({
    type: String,
    required: true,
  })
  destinationUrl: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  originName: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  destinationName: string;

  @Prop({
    type: String,
    required: false,
  })
  originPostalCode: string;

  @Prop({
    type: String,
    required: false,
  })
  destinationPostalCode: string;

  @Prop({
    type: String,
    required: true,
  })
  originCountryShortName: string;

  @Prop({
    type: String,
    required: true,
  })
  destinationCountryShortName: string;

  @Prop({
    type: String,
    required: true,
  })
  originCountryLongName: string;

  @Prop({
    type: String,
    required: true,
  })
  destinationCountryLongName: string;

  @Prop({
    type: String,
    required: true,
  })
  originProvinceShortName: string;

  @Prop({
    type: String,
    required: true,
  })
  destinationProvinceShortName: string;

  @Prop({
    type: String,
    required: true,
  })
  originProvinceLongName: string;

  @Prop({
    type: String,
    required: true,
  })
  destinationProvinceLongName: string;
  // should include date and time
  @Prop({
    required: true,
    type: Date,
    index: true,
  })
  leaving: Date;

  @Prop({
    required: true,
    type: Date,
    index: true,
  })
  arrivalTime: Date;

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
    required: true,
    type: Number,
  })
  totalRideAverageFuelCost: number;

  // TODO add recurring trip

  @Prop({
    type: String,
    enum: DriverRideStatus,
    default: DriverRideStatus.created,
  })
  status: string;

  // TODO also append vehicle details as document
  // vehicle details
  @Prop({
    required: true,
    ref: 'UserVehicle',
    type: mongoose.Types.ObjectId,
  })
  vehicleId: mongoose.Types.ObjectId;

  // Trip Preferences
  @Prop({
    type: String,
    index: true,
    required: true,
    enum: LuggageEnum,
  })
  luggage: LuggageEnum;

  @Prop({
    type: Number,
    required: true,
    index: true,
  })
  emptySeats: number;

  @Prop({
    type: Number,
    required: true,
    index: true,
  })
  availableSeats: number;

  @Prop({
    type: String,
    required: false,
  })
  tripDescription: string;
}

export type DriverRideDocument = DriverRide & Document;

const DriverRideScheme = SchemaFactory.createForClass(DriverRide);

DriverRideScheme.index({
  origin: '2dsphere',
  destination: '2dsphere',
  'stops.coordinates': '2dsphere',
});

export { DriverRideScheme };

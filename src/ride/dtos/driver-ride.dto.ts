import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { VehicleDto } from './vehicle.dto';
import { DriverRideStatus } from '../../driver/driver-ride.schema';
import { StopDto } from './stop.dto';
import { DateTime } from 'luxon';

export class DriverRideDto {
  @ApiProperty()
  @Transform(({ obj }) => obj._id)
  @Expose()
  rideId: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Transform(({ obj }) => obj.origin.coordinates[0])
  @Expose()
  originLongitude: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.origin.coordinates[1])
  @Expose()
  originLatitude: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.destination.coordinates[0])
  @Expose()
  destinationLongitude: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.destination.coordinates[1])
  @Expose()
  destinationLatitude: number;

  @ApiProperty()
  @Type(() => StopDto)
  @Expose()
  stops: StopDto[];

  @ApiProperty()
  @Expose()
  originAddress: number;

  @ApiProperty()
  @Expose()
  destinationAddress: number;

  @ApiProperty()
  @Expose()
  originPlaceId: number;

  @ApiProperty()
  @Expose()
  destinationPlaceId: number;

  @ApiProperty()
  @Expose()
  originUrl: number;

  @ApiProperty()
  @Expose()
  destinationUrl: number;

  @ApiProperty()
  @Expose()
  originName: number;

  @ApiProperty()
  @Expose()
  destinationName: number;

  @ApiProperty()
  @Expose()
  originPostalCode: number;

  @ApiProperty()
  @Expose()
  destinationPostalCode: number;

  @ApiProperty()
  @Expose()
  originCountryShortName: number;

  @ApiProperty()
  @Expose()
  destinationCountryShortName: number;

  @ApiProperty()
  @Expose()
  originCountryLongName: number;

  @ApiProperty()
  @Expose()
  destinationCountryLongName: number;

  @ApiProperty()
  @Expose()
  originProvinceShortName: number;

  @ApiProperty()
  @Expose()
  destinationProvinceShortName: number;

  @ApiProperty()
  @Expose()
  originProvinceLongName: number;

  @ApiProperty()
  @Expose()
  destinationProvinceLongName: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => {
    const date = DateTime.fromISO(new Date(value).toISOString());
    return date.toLocaleString(DateTime.DATETIME_SHORT);
  })
  leaving: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => {
    const date = DateTime.fromISO(new Date(value).toISOString());
    return date.toLocaleString(DateTime.DATETIME_SHORT);
  })
  arrivalTime: string;

  @ApiProperty()
  @Expose()
  totalRideDurationInSeconds: number;

  @ApiProperty()
  @Expose()
  totalRideDistanceInMeters: number;

  @ApiProperty()
  @Expose()
  totalRideAverageFuelCost: number;

  @ApiProperty({
    type: String,
    enum: DriverRideStatus,
  })
  @Expose()
  status: DriverRideStatus;

  @ApiProperty()
  @Type(() => VehicleDto)
  @Expose()
  vehicleId: VehicleDto; // TODO convert into vehicle

  @ApiProperty()
  @Expose()
  luggage: string;

  @ApiProperty()
  @Expose()
  emptySeats: string;

  @ApiProperty()
  @Expose()
  availableSeats: string;

  @ApiProperty()
  @Expose()
  tripDescription?: string;
}

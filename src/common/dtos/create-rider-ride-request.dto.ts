import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { IsFutureDateTime } from './create-driver-ride-request.dto';

export class CreateRiderRideRequestDto {
  @ApiProperty({
    description: 'Trip From - Place Id (Google Maps)',
  })
  @IsString()
  @IsNotEmpty()
  fromPlaceId: string;

  @ApiProperty({
    description: 'Trip To - Place Id (Google Maps)',
  })
  @IsString()
  @IsNotEmpty()
  toPlaceId: string;

  @ApiProperty({
    description:
      'Ride Departing / Starting Date and Time (YYYY-MM-DD HH:mm AM/PM)',
  })
  @IsFutureDateTime({
    message:
      'Departing date must be in the future in the format YYYY-MM-DD HH:mm AM/PM',
  })
  departing: string;

  @ApiProperty({
    description: 'Total Number of Seats to book',
    minimum: 1,
  })
  @IsInt({ message: 'Seats must be an integer' })
  @Min(1, { message: 'At least 1 empty seat is required' })
  seats: number;

  @ApiPropertyOptional({
    description: 'Max Price for each Seat',
  })
  @IsOptional()
  @IsInt({ message: 'Price must be an integer' })
  @Min(1, { message: "Price can't be negative or Zero" })
  maxPrice: number;

  @ApiPropertyOptional({
    description: 'Ride Description',
  })
  @IsOptional()
  @IsString()
  rideDescription: string;
}

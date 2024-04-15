import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CancelRideRequestDto {
  @ApiProperty({
    description: 'Valid Ride Id Created by Driver',
    type: String,
  })
  @IsMongoId({
    message: 'Must Be a Valid Ride Id',
  })
  @IsNotEmpty()
  rideId: mongoose.Types.ObjectId;
}

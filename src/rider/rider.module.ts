import { Module } from '@nestjs/common';
import { RiderService } from './rider.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RiderRideScheme } from './rider-ride-schema';
import { LocationModule } from '../location/location.module';
import { SnsModule } from '../sns/sns.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'RiderRide',
        schema: RiderRideScheme,
      },
    ]),
    LocationModule,
    SnsModule,
  ],
  providers: [RiderService],
  exports: [RiderService],
})
export class RiderModule {}

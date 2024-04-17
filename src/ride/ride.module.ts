import { Module, forwardRef } from '@nestjs/common';
import { DriverModule } from '../driver/driver.module';
import { UserModule } from '../user/user.module';
import { DriverService } from 'src/driver/driver.service';
import { RideController } from './ride.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserVehicleSchema } from 'src/common/schemas/user-vehicle.schema';
import { DriverRideScheme } from 'src/driver/driver-ride.schema';
import { LocationModule } from 'src/location/location.module';
import { MyConfigModule } from 'src/my-config/my-config.module';
import { UserSchema } from 'src/user/user.schema';
import { AdminuserModule } from 'src/adminuser/adminuser.module';
import { RiderModule } from 'src/rider/rider.module';
import { RiderRideScheme } from 'src/rider/rider-ride-schema';
import { RiderService } from 'src/rider/rider.service';

@Module({
  imports: [
    DriverModule, 
    UserModule,
    LocationModule,
    RiderModule,
    MyConfigModule,
    forwardRef(() => AdminuserModule),
    MongooseModule.forFeature([
      {
        name: 'UserVehicle',
        schema: UserVehicleSchema,
      },
      {
        name: 'DriverRide',
        schema: DriverRideScheme,
      },
      {
        name: 'RiderRide',
        schema: RiderRideScheme,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
  ])],
  controllers: [RideController],
  providers: [DriverService, RiderService],
})
export class RideModule {}
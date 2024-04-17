import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { MyConfigModule } from '../my-config/my-config.module';

@Module({
  imports: [MyConfigModule],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}

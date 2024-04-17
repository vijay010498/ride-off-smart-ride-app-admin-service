import { Module } from '@nestjs/common';
import { SqsProcessorService } from './sqs_processor.service';
import { UserModule } from '../user/user.module';
import { DriverModule } from 'src/driver/driver.module';
import { RiderModule } from 'src/rider/rider.module';

@Module({
  imports: [UserModule, DriverModule, RiderModule],
  providers: [SqsProcessorService],
  exports: [SqsProcessorService],
})
export class SqsProcessorModule {}

import { Module } from '@nestjs/common';
import { SqsProcessorService } from './sqs_processor.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [SqsProcessorService],
  exports: [SqsProcessorService],
})
export class SqsProcessorModule {}

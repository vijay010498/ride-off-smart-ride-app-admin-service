import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { MyConfigModule } from '../my-config/my-config.module';
import { SqsProcessorModule } from '../sqs_processor/sqs_processor.module';

@Module({
  imports: [MyConfigModule, SqsProcessorModule],
  providers: [SqsService],
})
export class SqsModule {}

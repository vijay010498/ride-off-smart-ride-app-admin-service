import { Module } from '@nestjs/common';
import { SnsService } from './sns.service';
import { MyConfigModule } from 'src/my-config/my-config.module';

@Module({
  imports: [MyConfigModule],
  providers: [SnsService],
  exports: [SnsService],
})
export class SnsModule {}

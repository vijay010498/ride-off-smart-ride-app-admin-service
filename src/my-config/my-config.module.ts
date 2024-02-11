import { Module } from '@nestjs/common';
import { MyConfigService } from './my-config.service';
@Module({
  providers: [MyConfigService],
  exports: [MyConfigService],
})
export class MyConfigModule {}

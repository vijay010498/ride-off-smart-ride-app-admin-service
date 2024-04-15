import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
  ) {}
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.db.pingCheck('mongodb', {
          timeout: 1500,
        }),
    ]);
  }
}

import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { DriverService } from '../driver/driver.service';
  import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiUnprocessableEntityResponse,
  } from '@nestjs/swagger';
  import { CurrentUserInterceptor } from '../common/interceptors/current-user.interceptor';
  import { AccessTokenGuard } from '../common/guards/accessToken.guard';
  import { IsBlockedGuard } from '../common/guards/isBlocked.guard';
  import { TokenBlacklistGuard } from '../common/guards/tokenBlacklist.guard';
  import { DriverRideDto } from './dtos/driver-ride.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptors';
import { parseDriverRideStatus } from 'src/driver/driver-ride.schema';
import { RiderService } from 'src/rider/rider.service';
import { RiderRideDto } from './dtos/rider-ride.dto';
  
  @ApiBearerAuth()
  @ApiTags('RIDES')
  @ApiForbiddenResponse({
    description: 'User is blocked',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid Token',
  })
  @ApiBadRequestResponse({
    description: 'User Does not exist / User Should be SignedUp to get Verified',
  })
  @Controller('rides')
  @UseInterceptors(CurrentUserInterceptor)
  @UseGuards(
    AccessTokenGuard,
    IsBlockedGuard,
    TokenBlacklistGuard,
  )
  export class RideController {
    constructor(
      private readonly driverService: DriverService,
      private readonly riderService: RiderService,
    ) {}
  
    @Get('/driver')
    @ApiOperation({
      summary: 'Get User Driver Rides',
    })
    @ApiResponse({
      description: 'Get Driver Rides',
      type: [DriverRideDto],
    })
    @Serialize(DriverRideDto)
    getUserDriverRides(@Query('id') id: string) {
      return this.driverService.getRideReportsByUser(id);
    }

    @Get('/driver/reports/date')
    @ApiOperation({
        summary: 'Get Driver Ride Reports by Date Range',
    })
    @ApiResponse({
        description: 'Get Driver Ride Reports',
        type: [DriverRideDto],
    })
    @Serialize(DriverRideDto)
    async getDriverRideReportsByDateRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
    return await this.driverService.getRideReportsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
    }

    @Get('/driver/reports')
    @ApiOperation({
        summary: 'Get Driver Ride Reports by Status',
    })
    @ApiResponse({
        description: 'Get Driver Ride Reports',
        type: [DriverRideDto],
    })
    @Serialize(DriverRideDto)
    async getDriverRideReportsByStatus(@Query('status') status: string) {
    var retrievedStatus = parseDriverRideStatus(status);
        return await this.driverService.getRideReportsByStatus(retrievedStatus);
    }
  
    @Get('/rider')
    @ApiOperation({
      summary: 'Get User Driver Rides',
    })
    @ApiResponse({
      description: 'Get Rider Rides',
      type: [RiderRideDto],
    })
    @Serialize(RiderRideDto)
    getUserRiderRides(@Query('id') id: string) {
      return this.riderService.getRideReportsByUser(id);
    }

    @Get('/rider/reports/date')
    @ApiOperation({
        summary: 'Get Rider Ride Reports by Date Range',
    })
    @ApiResponse({
        description: 'Get Driver Ride Reports',
        type: [DriverRideDto],
    })
    @Serialize(RiderRideDto)
    async getRiderRideReportsByDateRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
    return await this.riderService.getRideReportsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
    }

    @Get('/rider/reports')
    @ApiOperation({
        summary: 'Get Rider Ride Reports by Status',
    })
    @ApiResponse({
        description: 'Get Rider Ride Reports',
        type: [RiderRideDto],
    })
    @Serialize(DriverRideDto)
    async getRiderRideReportsByStatus(@Query('status') status: string) {
    var retrievedStatus = parseDriverRideStatus(status);
        return await this.driverService.getRideReportsByStatus(retrievedStatus);
    }
  }
  
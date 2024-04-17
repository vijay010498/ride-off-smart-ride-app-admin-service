import {
    registerDecorator,
    ValidationOptions,
    IsMongoId,
    IsEnum,
    IsString,
    IsOptional,
    IsInt,
    Min,
    IsNotEmpty,
    IsArray,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  import { LuggageEnum } from '../../driver/driver-ride.schema';
  import { DateTime } from 'luxon';
  
  export class CreateDriverRideRequestDto {
    @ApiProperty({
      description: 'Trip Origin - Place Id (Google Maps)',
    })
    @IsString()
    @IsNotEmpty()
    originPlaceId: string;
  
    @ApiProperty({
      description: 'Trip Destination - Place Id (Google Maps)',
    })
    @IsString()
    @IsNotEmpty()
    destinationPlaceId: string;
  
    @ApiProperty({
      description: 'Array of stops, Place Ids (Google Maps) - ordered',
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    stops?: [] = [];
  
    @ApiProperty({
      description:
        'Trip Leaving / Starting Date and Time (YYYY-MM-DD HH:mm AM/PM)',
    })
    @IsFutureDateTime({
      message:
        'Leaving date must be in the future in the format YYYY-MM-DD HH:mm AM/PM',
    })
    leaving: string;
  
    @ApiProperty({
      description: 'Valid Vehicle Id ,You can Create new Vehicle In User Profile',
    })
    @IsMongoId({
      message:
        'Must Be a Valid Vehicle Id ,You can Create new Vehicle In User Profile',
    })
    vehicleId: string;
  
    @ApiProperty({
      description: 'Luggage Details',
      type: String,
      enum: LuggageEnum,
      default: LuggageEnum.noLuggage,
    })
    @IsEnum(LuggageEnum)
    luggage: string;
  
    @ApiProperty({
      description: 'Total Number of Empty Seats',
      minimum: 1,
    })
    @IsInt({ message: 'Empty seats must be an integer' })
    @Min(1, { message: 'At least 1 empty seat is required' })
    emptySeats: number;
  
    @ApiPropertyOptional({
      description: 'Trip Description',
    })
    @IsOptional()
    @IsString()
    tripDescription: string;
  }
  
  // TODO move into common file
  export function IsFutureDateTime(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
      registerDecorator({
        name: 'isFutureDateTime',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any) {
            const dateTimeRegex =
              /^\d{4}-\d{2}-\d{2} (0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
  
            if (!dateTimeRegex.test(value)) return false;
  
            const parsedDate = DateTime.fromFormat(value, 'yyyy-MM-dd hh:mm a', {
              zone: 'America/New_York',
            });
            const currentDateTime = DateTime.local().setZone('America/New_York');
  
            return parsedDate.toMillis() > currentDateTime.toMillis();
          },
        },
      });
    };
  }
  
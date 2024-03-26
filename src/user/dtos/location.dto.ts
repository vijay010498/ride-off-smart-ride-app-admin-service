import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class LocationDto {
  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}
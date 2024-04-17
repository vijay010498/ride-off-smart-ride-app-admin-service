import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class StopDto {
  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  longitude: string;

  @ApiProperty()
  @Expose()
  latitude: string;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  postalCode?: string;

  @ApiProperty()
  @Expose()
  countryShortName: string;

  @ApiProperty()
  @Expose()
  countryLongName: string;

  @ApiProperty()
  @Expose()
  provinceShortName: string;

  @ApiProperty()
  @Expose()
  provinceLongName: string;

  @ApiProperty()
  @Expose()
  placeId: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => {
    const date = DateTime.fromISO(new Date(value).toISOString());
    return date.toLocaleString(DateTime.DATETIME_SHORT);
  })
  arrivalTime: string;

  @ApiProperty()
  @Expose()
  distanceFromPrevStopInMeters: number;

  @ApiProperty()
  @Expose()
  durationFromPrevStopInSeconds: number;
}

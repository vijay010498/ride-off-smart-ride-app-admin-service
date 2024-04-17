import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class VehicleDto {
  @ApiProperty()
  @Transform(({ obj }) => obj._id)
  @Expose()
  vehicleId: string;

  @ApiProperty()
  @Expose()
  model: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  color: string;

  @ApiProperty()
  @Expose()
  year: string;

  @ApiProperty()
  @Expose()
  licensePlate: string;

  @ApiProperty()
  @Expose()
  averageKmPerLitre: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.vehicleImagesObjectURLs)
  @Expose()
  vehicleImages: string[];
}

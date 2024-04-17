import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyConfigService {
  constructor(private readonly configService: ConfigService) {}

  //SQS Credentials
  getAWSSQSAccessID(): string {
    return this.configService.get<string>('aws_sqs_access_key_id');
  }

  getAWSSQSSecretKey(): string {
    return this.configService.get<string>('aws_sqs_secret_access_key');
  }

  getAwsRegion(): string {
    return this.configService.get<string>('aws_region');
  }

  getSqsQueueName(): string {
    return this.configService.get<string>('aws_sqs_queue_name');
  }

  getSqsQueueURL(): string {
    return this.configService.get<string>('aws_sqs_queue_url');
  }

  //SNS Credentials
  getAWSSNSAccessID(): string {
    return this.configService.get<string>('aws_sns_access_key_id');
  }

  getAWSSNSSecretKey(): string {
    return this.configService.get<string>('aws_sns_secret_access_key');
  }

  getAdminTopicSNSArn(): string {
    return this.configService.get<string>('ADMIN_TOPIC_SNS_ARN');
  }

  //JWT CREDENTIALS
  getJwtAccessSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET');
  }

  //DATABASE CREDENTIALS
  getMongoUri(): string {
    return this.configService.get<string>('MONGODB_URI_ADMIN');
  }

  getMongoDatabase(): string {
    return this.configService.get<string>('MONGO_ADMIN_DATABASE');
  }

  getNotificationEmail(): string {
    return this.configService.get<string>('NOTIFICATION_EMAIL');
  }

  //ENVIRONMENT CONFIG SETTINGS
  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  getGoogleMapsGeocodeKey(): string {
    return this.configService.get<string>('google_maps_geocode_Key');
  }

  getGoogleMapsPlacesKey(): string {
    return this.configService.get<string>('google_maps_place_key');
  }

  getGoogleMapsRoutesKey(): string {
    return this.configService.get<string>('google_maps_routes_key');
  }

  getAverageFuelCost(): string {
    return this.configService.get<string>('AVG_FUEL_COST');
  }
}

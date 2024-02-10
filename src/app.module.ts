import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SqsModule } from './sqs/sqs.module';
import { SqsProcessorModule } from './sqs_processor/sqs_processor.module';
import { MyConfigModule } from './my-config/my-config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MyConfigService } from './my-config/my-config.service';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { CacheModule } from '@nestjs/cache-manager';




@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV}`,
  }),
  CacheModule.register({
    isGlobal: true, // So we don't need to register in each module
  }),
  DevtoolsModule.registerAsync({
    imports: [MyConfigModule],
    useFactory: (configService: MyConfigService) => ({
      http: configService.getNodeEnv() !== 'production',
    }),
    inject: [MyConfigService],
  }),
  MongooseModule.forRootAsync({
    imports: [MyConfigModule],
    useFactory: (configService: MyConfigService) => ({
      uri: configService.getMongoUri(),
      dbName: configService.getMongoDatabase(),
      autoIndex: true,
    }),
    inject: [MyConfigService],
  }),
    UserModule,
    SqsModule,
    SqsProcessorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

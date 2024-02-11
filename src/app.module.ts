import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MyConfigModule } from './my-config/my-config.module';
import { MyConfigService } from './my-config/my-config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SqsModule } from './sqs/sqs.module';
import { SqsProcessorModule } from './sqs_processor/sqs_processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    CacheModule.register({
      isGlobal: true,
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
    SqsProcessorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

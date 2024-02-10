import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const env = process.env.NODE_ENV || 'development';

  if (!fs.existsSync(`.env.${env}`)) {
    const errorMessage = `Environment file (.env.${env}) not found. Please create the environment file and add necessary env variables`;
    throw Object.assign(new Error(errorMessage), { code: 'ENV_ERROR' });
  }

  dotenv.config({
    path: `.env.${env}`,
  });

  const requiredEnvVariables = [
    'MONGODB_URI_ADMIN',
    'MONGO_ADMIN_DATABASE',
    'aws_sqs_access_key_id',
    'aws_sqs_secret_access_key',
    'AUTH_TOPIC_SNS_ARN',
    'aws_sqs_queue_name',
    'aws_sqs_queue_url',
    'aws_region',
  ];

  const missingVariables = requiredEnvVariables.filter((variable) => {
    return !process.env[variable];
  });

  if (missingVariables.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVariables.join(', ')}`;
    throw Object.assign(new Error(errorMessage), { code: 'ENV_ERROR' });
  }

  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
    cors: true,
  });
  app.setGlobalPrefix('api/admin');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // If set to true validator will strip validated object of any properties that do not have any decorators Tip: if no other decorator is suitable for your property use @Allow decorator.
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Admin Service')
    .setDescription('Smart Ride App Authentication Service')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap().catch((error) => {
  if (error.code && error.code.startsWith('ENV')) {
    Logger.error(`Failed to start application: ${error}`);
  } else fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
  process.exit(1);
});

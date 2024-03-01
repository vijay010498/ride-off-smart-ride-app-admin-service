import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SendmailService {
  private readonly sesClient: SESClient;
  private readonly notificationEmail : string;

  constructor(private readonly configService: ConfigService) {
    this.notificationEmail = this.configService.get('NOTIFICATION_EMAIL');
    this.sesClient = new SESClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async sendEmail(toAddress: string, message: string, subject: string)
  {
    new SendEmailCommand({
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Body: {
          Text: {
            Data: message,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: this.notificationEmail,
    });
  };
}

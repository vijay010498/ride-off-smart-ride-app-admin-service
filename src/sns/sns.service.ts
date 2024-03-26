import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';
import { MyConfigService } from 'src/my-config/my-config.service';
import { Events } from 'src/sqs_processor/events.enums';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class SnsService {
    private readonly logger = new Logger(SnsService.name);
    private readonly SNS: SNSClient;

    constructor(private readonly configService: MyConfigService) {
        this.SNS = new SNSClient({
          apiVersion: 'latest',
          region: this.configService.getAwsRegion(),
          credentials: {
            accessKeyId: this.configService.getAWSSNSAccessID(),
            secretAccessKey: this.configService.getAWSSNSSecretKey(),
          },
        });
    }

    async userUpdatedEvent(
        updatedUser: UserDocument,
        EVENT_TYPE: string = Events.userUpdated,
      ) {
        const snsMessage = Object.assign(
          { updatedUser },
          { EVENT_TYPE, userId: updatedUser.id },
        );
        
        return this._publishToAdminTopicARN(JSON.stringify(snsMessage));
      }
    

    private async _publishToAdminTopicARN(Message: string) {
        try {
          const messageParams = {
            Message,
            TopicArn: this.configService.getAdminTopicSNSArn(),
          };
    
          const { MessageId } = await this.SNS.send(
            new PublishCommand(messageParams),
          );
          this.logger.log('publishToAdminTopicSNS-success', MessageId);
        } catch (_publishToAuthTopicARNError) {
          this.logger.error(
            'publishToAdminTopicSNSError',
            _publishToAuthTopicARNError,
          );
        }
    }
}

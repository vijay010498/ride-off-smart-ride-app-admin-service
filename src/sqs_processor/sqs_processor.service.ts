import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Message } from '@aws-sdk/client-sqs';
import { Events } from './events.enums';

@Injectable()
export class SqsProcessorService {
  private readonly logger = new Logger(SqsProcessorService.name);

  constructor(private readonly userService: UserService) {}

  async ProcessSqsMessage(messages: Message[]) {
    try {
      await Promise.all(
        messages.map(({ Body }) => {
          try {
            const parsedBody = JSON.parse(Body);
            const parsedMessage = JSON.parse(parsedBody.Message);
            if (parsedMessage['EVENT_TYPE']) {
              const { EVENT_TYPE, user, userId, token, updatedUser } =
                parsedMessage;
              this.logger.log(EVENT_TYPE, user, userId, token, updatedUser);
              switch (EVENT_TYPE) {
                case Events.userCreatedByPhone:
                  return this._handleUserCreationByPhone(user, userId);
                case Events.tokenBlackList:
                  return this._handleTokenBlackListEvent(token);
                case Events.userUpdated:
                  return this._handleUserUpdatedEvent(updatedUser, userId);
                default:
                  this.logger.warn(`Unhandled event type: ${EVENT_TYPE}`);
                  break;
              }
            }
          } catch (error) {
            this.logger.error('Error processing SQS message:', error);
          }
        }),
      );
    } catch (error) {
      this.logger.error('Error processing SQS messages:', error);
    }
  }

  private async _handleUserCreationByPhone(user: any, userId: string) {
    try {
      await this.userService.createUserByPhone(user, userId);
    } catch (error) {
      this.logger.error('Error creating user by phone:', error);
      throw error;
    }
  }

  private async _handleTokenBlackListEvent(token: string) {
    try {
      await this.userService.addTokenInBlackList(token);
    } catch (error) {
      this.logger.error('Error handleTokenBlackListEvent', error);
      throw error;
    }
  }

  private async _handleUserUpdatedEvent(updatedUser: any, userId: string) {
    try {
      await this.userService.updateUser(userId, updatedUser);
    } catch (error) {
      this.logger.error('Error handleUserUpdatedEvent', error);
      throw error;
    }
  }
}

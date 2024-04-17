import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Message } from '@aws-sdk/client-sqs';
import { Events } from './events.enums';
import { DriverService } from 'src/driver/driver.service';
import { RiderService } from 'src/rider/rider.service';

@Injectable()
export class SqsProcessorService {
  private readonly logger = new Logger(SqsProcessorService.name);

  constructor(
    private readonly userService: UserService,
    private readonly driverService: DriverService,
    private readonly riderService: RiderService
  ) {}

  async ProcessSqsMessage(messages: Message[]) {
    try {
      await Promise.all(
        messages.map(({ Body }) => {
          try {
            const parsedBody = JSON.parse(Body);
            const parsedMessage = JSON.parse(parsedBody.Message);
            if (parsedMessage['EVENT_TYPE']) {
              const { EVENT_TYPE, user, userId, updatedUser } = parsedMessage;
              this.logger.log(EVENT_TYPE, user, userId, updatedUser);
              this.logger.log(parsedBody)
              switch (EVENT_TYPE) {
                case Events.userCreatedByPhone:
                  return this._handleUserCreationByPhone(user, userId);
                case Events.userUpdated:
                  return this._handleUserUpdatedEvent(updatedUser, userId);
                case Events.newDriverRideCreated:
                  if (parsedMessage.origin && parsedMessage.destination) {
                    return this._handleDriverRideCreatedEvent(parsedMessage)
                  }
                case Events.driverRideCancelled:
                  if (parsedMessage.origin && parsedMessage.destination) {
                    return this._handleDriverRideCanceledEvent(parsedMessage)
                  }
                case Events.newRiderRideCreated:
                  if (parsedMessage.origin && parsedMessage.destination) {
                    return this._handleRiderRideCreatedEvent(parsedMessage)
                  }
                case Events.riderRideCancelled:
                  if (parsedMessage.origin && parsedMessage.destination) {
                    return this._handleRiderRideCanceledEvent(parsedMessage)
                  }
                default:
                  this.logger.warn(`Unhandled event type: ${EVENT_TYPE}`);
                  break;
              }
            }
          } catch (error) {
            this.logger.error('Error Parsing message:', error);
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

  private async _handleUserUpdatedEvent(updatedUser: any, userId: string) {
    try {
      await this.userService.updateUser(userId, updatedUser);
    } catch (error) {
      this.logger.error('Error handleUserUpdatedEvent', error);
      throw error;
    }
  }

  private async _handleDriverRideCanceledEvent(canceledRide: any){
    try {
      await this.driverService.cancelRide(canceledRide._id, canceledRide.userId)
    } catch (error) {
      this.logger.error('Error handleDriverRideCanceledEvent', error);
      throw error;
    }
  }

  private async _handleDriverRideCreatedEvent(createdRide: any){
    try {
      await this.driverService.createRide(createdRide, createdRide.userId)
    } catch (error) {
      this.logger.error('handleDriverRideCreatedEvent', error);
      throw error;
    }
  }

  private async _handleRiderRideCanceledEvent(canceledRide: any){
    try {
      await this.riderService.cancelRide(canceledRide._id, canceledRide.userId)
    } catch (error) {
      this.logger.error('Error handleDriverRideCanceledEvent', error);
      throw error;
    }
  }

  private async _handleRiderRideCreatedEvent(createdRide: any){
    try {
      await this.riderService.createRide(createdRide, createdRide.userId)
    } catch (error) {
      this.logger.error('handleDriverRideCreatedEvent', error);
      throw error;
    }
  }


}

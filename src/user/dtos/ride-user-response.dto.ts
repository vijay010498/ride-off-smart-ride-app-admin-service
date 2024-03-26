import { LocationDto } from "./location.dto";

export interface RideUserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isSignedUp : boolean;
    isVerified : boolean;
    isBlocked: boolean;
    lastLocation : LocationDto
  }
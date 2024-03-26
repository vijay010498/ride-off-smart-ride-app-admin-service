import { AdminUserType } from "../adminuser.schema";

export interface AdminResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: AdminUserType;
    isBlocked: boolean;
  }
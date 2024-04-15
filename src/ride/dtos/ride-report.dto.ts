export class RideReportDto {
    userId: string;
    originAddress: string;
    destinationAddress: string;
    stops: string[];
    leaving: Date;
    arrivalTime: Date;
    totalRideDurationInSeconds: number;
    totalRideDistanceInMeters: number;
    status: string;
    vehicleId: string;
    luggage: string;
    emptySeats: number;
    availableSeats: number;
    tripDescription: string;
  }
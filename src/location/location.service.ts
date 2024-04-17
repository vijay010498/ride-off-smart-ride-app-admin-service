import { Injectable, Logger } from '@nestjs/common';
import {
  AddressComponent,
  Client,
  DirectionsRequest,
  DirectionsResponse,
  Language,
  PlaceDetailsRequest,
  PlaceType2,
  TravelMode,
  TravelRestriction,
  UnitSystem,
} from '@googlemaps/google-maps-services-js';
import { MyConfigService } from '../my-config/my-config.service';

export type GetDriverRideLocationDetailsRequest = {
  originPlaceId: string;
  destinationPlaceId: string;
  stops?: [];
  leavingTime: string;
};

export type GetRiderRideLocationDetailsRequest = {
  fromPlaceId: string;
  toPlaceId: string;
  departureTime: string;
};

interface StopDetails {
  arrivalTime: Date;
  distanceFromPrevStopInMeters: number;
  durationFromPrevStopInSeconds: number;
}

export interface RideLocationDetailsResponse {
  totalRideDurationInSeconds: number;
  totalRideDistanceInMeters: number;
  stopDetails: StopDetails[];
  arrivalTime: Date;
}

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  private readonly googleMapsClient: Client;

  constructor(private readonly configService: MyConfigService) {
    this.googleMapsClient = new Client({});
  }

  async getPlaceDetails(placeId: string) {
    try {
      const placeDetailsRequest: PlaceDetailsRequest = {
        params: {
          key: this.configService.getGoogleMapsPlacesKey(),
          place_id: placeId,
          language: Language.en,
          region: 'ca',
          fields: [
            'address_components',
            'formatted_address',
            'geometry',
            'url',
            'name',
          ],
        },
      };

      const {
        data: { result },
      } = await this.googleMapsClient.placeDetails(placeDetailsRequest);

      // TODO add code to check only for supported places

      if (!result) return {};
      const {
        postalCode,
        countryShortName,
        countryLongName,
        provinceShortName,
        provinceLongName,
      } = this.decodeAddressComponents(result.address_components);

      return {
        address: result.formatted_address,
        longitude: result.geometry.location.lng,
        latitude: result.geometry.location.lat,
        url: result.url,
        name: result.name,
        postalCode,
        countryShortName,
        countryLongName,
        provinceShortName,
        provinceLongName,
        placeId,
      };
    } catch (error) {
      this.logger.error('getPlaceDetails-error', error);
      throw new Error('Error in Getting Place Details');
    }
  }

  private decodeAddressComponents(addressComponents: AddressComponent[]) {
    let postalCode = null;
    let countryShortName = null;
    let countryLongName = null;
    let provinceShortName = null;
    let provinceLongName = null;

    for (const component of addressComponents) {
      if (component.types.includes(PlaceType2.postal_code)) {
        postalCode = component.short_name;
      }

      if (component.types.includes(PlaceType2.country)) {
        countryShortName = component.short_name;
        countryLongName = component.long_name;
      }

      if (component.types.includes(PlaceType2.administrative_area_level_1)) {
        provinceShortName = component.short_name;
        provinceLongName = component.long_name;
      }
    }

    return {
      postalCode,
      countryShortName,
      countryLongName,
      provinceShortName,
      provinceLongName,
    };
  }

  async getDriverRideRouteDetails(
    request: GetDriverRideLocationDetailsRequest,
  ): Promise<RideLocationDetailsResponse> {
    try {
      const directionsRequest: DirectionsRequest = {
        params: {
          key: this.configService.getGoogleMapsRoutesKey(),
          origin: `place_id:${request.originPlaceId}`,
          destination: `place_id:${request.destinationPlaceId}`,
          mode: TravelMode.driving,
          avoid: [TravelRestriction.tolls],
          waypoints: request?.stops.map((placeId) => `place_id:${placeId}`),
          language: Language.en,
          units: UnitSystem.metric,
          region: 'ca',
          departure_time: new Date(request.leavingTime),
          optimize: false,
        },
      };

      const { data }: DirectionsResponse =
        await this.googleMapsClient.directions(directionsRequest);

      const { legs } = data.routes[0];

      let totalRideDurationInSeconds = 0;
      let totalRideDistanceInMeters = 0;
      const stopDetails: StopDetails[] = [];
      let departureTime = new Date(request.leavingTime);
      for (const leg of legs) {
        const arrivalTime = new Date(departureTime);
        arrivalTime.setSeconds(arrivalTime.getSeconds() + leg.duration.value);
        stopDetails.push({
          arrivalTime,
          distanceFromPrevStopInMeters: leg.distance.value,
          durationFromPrevStopInSeconds: leg.duration.value,
        });
        departureTime = arrivalTime;

        totalRideDurationInSeconds += leg.duration.value;
        totalRideDistanceInMeters += leg.distance.value;
      }

      const arrivalAtDestination = new Date(departureTime);
      arrivalAtDestination.setSeconds(
        arrivalAtDestination.getSeconds() +
          legs[legs.length - 1].duration.value,
      );
      return {
        totalRideDurationInSeconds,
        totalRideDistanceInMeters,
        stopDetails,
        arrivalTime: arrivalAtDestination,
      };
    } catch (error) {
      this.logger.error('getDriverRideRouteDetails-error', error);
      throw new Error('Error in Getting Driver Ride Location Details');
    }
  }

  async getRiderRideRouteDetails(request: GetRiderRideLocationDetailsRequest) {
    try {
      const directionsRequest: DirectionsRequest = {
        params: {
          key: this.configService.getGoogleMapsRoutesKey(),
          origin: `place_id:${request.fromPlaceId}`,
          destination: `place_id:${request.toPlaceId}`,
          mode: TravelMode.driving,
          avoid: [TravelRestriction.tolls],
          language: Language.en,
          units: UnitSystem.metric,
          region: 'ca',
          departure_time: new Date(request.departureTime),
          optimize: false,
        },
      };

      const { data }: DirectionsResponse =
        await this.googleMapsClient.directions(directionsRequest);

      const { legs } = data.routes[0];

      let totalRideDurationInSeconds = 0;
      let totalRideDistanceInMeters = 0;
      let departureTime = new Date(request.departureTime);
      for (const leg of legs) {
        const arrivalTime = new Date(departureTime);
        arrivalTime.setSeconds(arrivalTime.getSeconds() + leg.duration.value);
        departureTime = arrivalTime;

        totalRideDurationInSeconds += leg.duration.value;
        totalRideDistanceInMeters += leg.distance.value;
      }
      return {
        totalRideDurationInSeconds,
        totalRideDistanceInMeters,
      };
    } catch (error) {
      this.logger.error('getRiderRideRouteDetails-error', error);
      throw new Error('Error in Getting Driver Ride Location Details');
    }
  }
}

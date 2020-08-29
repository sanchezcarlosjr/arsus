import { Database } from '../database/database';
import { Coordinates, ResponseGoogleMaps, ResponseMatrixGoogleMaps } from '../definitions/google-maps-response';

const request = require('request-promise');
// Google Maps, Promise state,  Enum data.

export interface LocationState {
  handle(): Promise<any>;
}

export class UserLocationState implements LocationState {
  private database = new Database();
  constructor(private locationContext: LocationContext, private userUID: string) {}
  handle() {
    const localization = this.locationContext.getData();
    return this.database.collection(`users/${this.userUID}/locations`).storeWith(localization.place_id, localization);
  }
}

export class LocationContext {
  private data: any;
  constructor(private state: LocationState) {}
  public setState(state: LocationState) {
    this.state = state;
  }
  public getData() {
    return this.data;
  }
  public async request() {
    this.data = await this.state.handle();
  }
}

export class UserLocalization {
  private readonly apiKey = '';
  private database = new Database();

  constructor(private coordinates: Coordinates, private userUID: string) {}

  async locate(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          uri: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.coordinates.coords.latitude},${this.coordinates.coords.longitude}&key=${this.apiKey}`,
          json: true,
        };
        const response: ResponseGoogleMaps = await request(options);
        const localization = response.results[0];
        this.database.collection(`users/${this.userUID}/locations`).storeWith(localization.place_id, {
          ...localization,
          timestamp: this.coordinates.timestamp,
          originalCoords: this.coordinates.coords,
        });
        if (this.coordinates.articlesCoords) {
          const options2 = {
            uri: this.generateURI(),
            json: true,
          };
          const responseMatrix: ResponseMatrixGoogleMaps = await request(options2);
          const timeTotal =
            responseMatrix.rows[0].elements.reduce((total, current) => total + current.duration.value, 0) / 60;
          resolve({
            address: localization.formatted_address,
            time: Math.ceil(timeTotal) + 7,
            delivery: 0,
          });
        } else {
          resolve({
            address: localization.formatted_address,
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  generateURI() {
    const destination = this.coordinates.articlesCoords
      .map((element) => `${element.latitude},${element.longitude}`)
      .join('|');
    return `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.coordinates.coords.latitude},${this.coordinates.coords.longitude}&destinations=${destination}&key=`;
  }
}

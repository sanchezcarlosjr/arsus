import { Coordinates, ResponseGoogleMaps } from '../definitions/google-maps-response';
const request = require('request-promise');

export class GoogleMaps {
  private options = {
    uri: '',
    json: true,
  };
  constructor(private coordinates: Coordinates) {}
  public handle(): Promise<ResponseGoogleMaps> {
    return request(this.options);
  }
  public createUserUri(apiKey = '') {
    this.options.uri = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.coordinates.coords.latitude},${this.coordinates.coords.longitude}&key=${apiKey}`;
  }
  public createArticleOptions(apiKey = '') {
    const destination = this.coordinates.articlesCoords
      .map((element) => `${element.latitude},${element.longitude}`)
      .join('|');
    this.options.uri = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.coordinates.coords.latitude},${this.coordinates.coords.longitude}&destinations=${destination}&key=${apiKey}`;
  }
}

import * as https from 'firebase-functions/lib/providers/https';
import { GoogleMaps } from '../providers/google-maps.provider';
import { Coordinates, ResponseGoogleMaps } from '../definitions/google-maps-response';

enum Errors {
  GPS = 'Da permisos a la app para ubicarte',
}

class LocalizationData {
  private initialData = {
    address: '',
    delivery: 0,
    time: 12,
  };
  setAddress(address: string) {
    this.initialData.address = address;
    return this;
  }
  setElements(elements: any) {
    this.initialData.time =
      Math.ceil(elements.reduce((total: number, current: any) => total + current.duration.value, 0) / 60) + 5;
    const delivery = Math.ceil(this.initialData.time * 2);
    this.initialData.delivery = this.initialData.time <= 12 ? 0 : delivery;
  }
  getData() {
    return this.initialData;
  }
}

export const locateUserHandler = async (body: Coordinates, context: https.CallableContext) => {
  const localizationData = new LocalizationData();
  const googleMaps = new GoogleMaps(body);
  googleMaps.createUserUri();
  const onfulfilled = (response: ResponseGoogleMaps) => {
    localizationData.setAddress(response.results[0].formatted_address);
    googleMaps.createArticleOptions();
    return googleMaps.handle();
  };
  const matrixOnfulfilled = (resp: any) => {
    localizationData.setElements(resp.rows[0].elements);
    return localizationData.getData();
  };
  return googleMaps
    .handle()
    .then(onfulfilled)
    .then(matrixOnfulfilled)
    .catch((error) => Errors.GPS);
};

import { Database } from '../../../../database/database';
import { get } from 'request-promise';

export interface ProviderDataAdaptable {
  createOptionsFor: (tokenUID: any) => { uri: string; qs?: any; headers?: any; auth?: any; json: boolean };
  map: (providerResponse: any) => any[];
}

export class ProviderDataAdapter {
  private database = new Database();

  constructor(private userUID: string, private tokenUID: any) {}

  adapt(providerData: ProviderDataAdaptable) {
    const name = providerData.constructor.name.toUpperCase();
    return get(providerData.createOptionsFor(this.tokenUID)).then((providerResponse) => {
      const subscriptions = providerData.map(providerResponse);
      return this.database.collection(`users/${this.userUID}/providers`).storeWith(name, {
        subscriptions,
      });
    });
  }
}

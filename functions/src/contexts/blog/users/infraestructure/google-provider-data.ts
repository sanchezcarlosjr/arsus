import { Youtube } from './Youtube';
import { ProviderDataAdapter } from './ProviderDataAdapter';
import { Google } from './Google';

export class GoogleProviderData {
  constructor(private accessToken: string, private userUID: string) {}

  store() {
    const providerDataAdapter = new ProviderDataAdapter(this.userUID, this.accessToken);
    return providerDataAdapter.adapt(new Google()).then(() => providerDataAdapter.adapt(new Youtube()));
  }
}

import { IntentProviderCreator } from '../domain/IntentProviderCreator';
import { DialogflowIntentCreatorAdapter } from '../infraestructure/DialogflowIntentCreatorAdapter';

export class IntentCreator {
  constructor(private provider: IntentProviderCreator) {}

  async create(adapter: DialogflowIntentCreatorAdapter) {
    return await this.provider.create(adapter.adapt());
  }
}

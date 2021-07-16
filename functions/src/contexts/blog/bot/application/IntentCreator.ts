import { IntentProviderCreator } from '../domain/IntentProviderCreator';
import { DialogflowIntentCreatorAdapter } from '../infraestructure/DialogflowIntentCreatorAdapter';
import { Database } from '../../../../database/database';

export class IntentCreator {
  private database = new Database();

  constructor(private provider: IntentProviderCreator) {}

  async create(id: string, adapter: DialogflowIntentCreatorAdapter) {
    const response = await this.provider.create(adapter.adapt());
    return this.database.collection('QuestionsGame').update(id, {
      intentId: response.name.match('[0-9a-z-]{36}')[0],
      outputContext: response.outputContexts.map((context) => {
        return context.name;
      }),
    });
  }
}

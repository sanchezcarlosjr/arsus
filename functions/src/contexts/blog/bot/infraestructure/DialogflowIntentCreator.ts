import dialogflow from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { IntentProviderCreator } from '../domain/IntentProviderCreator';

export class DialogflowIntentCreator implements IntentProviderCreator {
  private intentsClient = new dialogflow.IntentsClient();

  public async create(intent: google.cloud.dialogflow.v2.IIntent) {
    const [response] = await this.intentsClient.createIntent({
      parent: this.intentsClient.agentPath('arsus-production'),
      intent,
    });
    return response;
  }
}

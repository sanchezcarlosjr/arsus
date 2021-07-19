import dialogflow from '@google-cloud/dialogflow';

export class DialogflowIntentListing {
  private intentsClient = new dialogflow.IntentsClient();

  async list() {
    const projectAgentPath = this.intentsClient.agentPath('arsus-production');
    const [response] = await this.intentsClient.listIntents({
      parent: projectAgentPath,
      intentView: 'INTENT_VIEW_FULL',
    });
    return response;
  }
}

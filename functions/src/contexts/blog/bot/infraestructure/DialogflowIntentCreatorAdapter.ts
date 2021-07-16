import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { IntentCreatorAdapter } from '../domain/IntentCreatorAdapter';
import Type = google.cloud.dialogflow.v2beta1.Intent.TrainingPhrase.Type;
import IIntent = google.cloud.dialogflow.v2.IIntent;

export class DialogflowIntentCreatorAdapter implements IntentCreatorAdapter {
  constructor(
    private displayName: string,
    private trainingPhrasesParts: string[],
    private messageTexts: string[],
    private hasOutputContext: boolean = false,
    private parentFollowupIntentName: string = null,
    private inputContextNames: string[] = null
  ) {}

  adapt(): IIntent {
    return {
      displayName: this.displayName,
      trainingPhrases: this.mapTrainingPhrasesParts(),
      messages: this.mapMessageTexts(),
      parentFollowupIntentName: this.mapParentFollowupIntentName(),
      inputContextNames: this.mapInputContextNames(),
      outputContexts: this.mapOutpuContexts(),
    };
  }

  private mapOutpuContexts() {
    return this.hasOutputContext
      ? [
          {
            name: `projects/arsus-production/agent/sessions/-/contexts/${this.displayName}f`,
            lifespanCount: 3,
          },
        ]
      : null;
  }

  private mapParentFollowupIntentName() {
    return this.parentFollowupIntentName !== null
      ? `projects/arsus-production/agent/intents/${this.parentFollowupIntentName}`
      : null;
  }

  private mapInputContextNames() {
    return this.inputContextNames?.map(
      (inputContextName) => `projects/arsus-production/agent/sessions/-/contexts/${inputContextName}`
    );
  }

  private mapMessageTexts() {
    return [
      {
        text: {
          text: this.messageTexts,
        },
      },
    ];
  }

  private mapTrainingPhrasesParts() {
    return this.trainingPhrasesParts.map((trainingPhrasesPart: string) => {
      return {
        type: Type.EXAMPLE,
        parts: [
          {
            text: trainingPhrasesPart,
          },
        ],
      };
    });
  }
}

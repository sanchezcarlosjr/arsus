import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { IntentCreatorAdapter } from '../domain/IntentCreatorAdapter';
import Type = google.cloud.dialogflow.v2beta1.Intent.TrainingPhrase.Type;
import IIntent = google.cloud.dialogflow.v2.IIntent;

export class DialogflowIntentCreatorAdapter implements IntentCreatorAdapter {
  constructor(
    private intent: {
      displayName: string;
      trainingPhrasesParts: string[];
      messageTexts: string[];
      hasOutputContext: boolean;
      parentFollowupIntentName: string;
      inputContextNames: string[];
    }
  ) {}

  adapt(): IIntent {
    return {
      displayName: this.intent.displayName,
      trainingPhrases: this.mapTrainingPhrasesParts(),
      messages: this.mapMessageTexts(),
      parentFollowupIntentName: this.mapParentFollowupIntentName(),
      inputContextNames: this.mapInputContextNames(),
      outputContexts: this.mapOutputContexts(),
    };
  }

  private mapOutputContexts() {
    return this.intent.hasOutputContext
      ? [
          {
            name: `projects/arsus-production/agent/sessions/-/contexts/${this.intent.displayName}f`,
            lifespanCount: 3,
          },
        ]
      : null;
  }

  private mapParentFollowupIntentName() {
    return this.intent.parentFollowupIntentName !== null
      ? `projects/arsus-production/agent/intents/${this.intent.parentFollowupIntentName}`
      : null;
  }

  private mapInputContextNames() {
    return this.intent.inputContextNames?.map(
      (inputContextName) => `projects/arsus-production/agent/sessions/-/contexts/${inputContextName}`
    );
  }

  private mapMessageTexts() {
    return [
      {
        text: {
          text: this.intent.messageTexts,
        },
      },
    ];
  }

  private mapTrainingPhrasesParts() {
    return this.intent.trainingPhrasesParts.map((trainingPhrasesPart: string) => {
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

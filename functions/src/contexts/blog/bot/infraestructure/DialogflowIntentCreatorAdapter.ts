import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { IntentCreatorAdapter } from '../domain/IntentCreatorAdapter';
import Type = google.cloud.dialogflow.v2beta1.Intent.TrainingPhrase.Type;

export class DialogflowIntentCreatorAdapter implements IntentCreatorAdapter {
  constructor(private displayName: string, private trainingPhrasesParts: string[], private messageTexts: string[]) {}

  adapt() {
    return {
      displayName: this.displayName,
      trainingPhrases: this.mapTrainingPhrasesParts(),
      messages: this.mapMessageTexts(),
    };
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

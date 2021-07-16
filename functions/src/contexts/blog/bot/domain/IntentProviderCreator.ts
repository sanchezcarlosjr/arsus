import { google } from '@google-cloud/dialogflow/build/protos/protos';
import IIntent = google.cloud.dialogflow.v2beta1.IIntent;

export interface IntentProviderCreator {
  create: (intent: google.cloud.dialogflow.v2.IIntent) => Promise<IIntent>;
}

import { Database } from '../../../../database/database';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export interface Reply {
  displayName: string;
  type: string;
  messageTexts: string[];
  parentFollowupIntentName: string;
  inputContextNames: string[];
}

export class ReplyAdapter {
  private database = new Database();

  constructor(private documentSnapshot: DocumentSnapshot) {}

  async adapt() {
    const reply = this.documentSnapshot.data() as Reply;
    const trainingPhrasesPartsDocuments = await this.database
      .collection('QuestionsGameTrainingPhrases')
      .whereData('type', '==', reply.type);
    const trainingPhrasesParts = trainingPhrasesPartsDocuments.map((trainingPhrase) => {
      return trainingPhrase.phrase;
    });
    return {
      displayName: reply.displayName,
      trainingPhrasesParts,
      messageTexts: reply.messageTexts,
      hasOutputContext: true,
      parentFollowupIntentName: reply.parentFollowupIntentName,
      inputContextNames: reply.inputContextNames,
    };
  }
}

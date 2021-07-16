import * as functions from 'firebase-functions';
import { EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { DialogflowIntentCreatorAdapter } from '../../../contexts/blog/bot/infraestructure/DialogflowIntentCreatorAdapter';
import { IntentCreator } from '../../../contexts/blog/bot/application/IntentCreator';
import { DialogflowIntentCreator } from '../../../contexts/blog/bot/infraestructure/DialogflowIntentCreator';

export const QuestionsGameCreatorHook = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '2GB',
  })
  .firestore.document('20QuestionsGame/{uuid}')
  .onCreate(async (documentSnapshot: DocumentSnapshot, context: EventContext) => {
    const data = documentSnapshot.data();
    const dialogflowIntentCreatorAdapter = new DialogflowIntentCreatorAdapter(
      data.displayName,
      data.trainingPhrasesParts,
      data.trainingPhrasesParts
    );
    const intentCreator = new IntentCreator(new DialogflowIntentCreator());
    await intentCreator.create(dialogflowIntentCreatorAdapter);
  });

import * as functions from 'firebase-functions';
import { EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { DialogflowIntentCreatorAdapter } from '../../../contexts/blog/bot/infraestructure/DialogflowIntentCreatorAdapter';
import { IntentCreator } from '../../../contexts/blog/bot/application/IntentCreator';
import { DialogflowIntentCreator } from '../../../contexts/blog/bot/infraestructure/DialogflowIntentCreator';
import { ReplyAdapter } from '../../../contexts/blog/bot/application/ReplyAdapter';

export const QuestionsGameCreatorHook = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '2GB',
  })
  .firestore.document('20QuestionsGame/{uuid}')
  .onCreate(async (documentSnapshot: DocumentSnapshot, context: EventContext) => {
    const reply = new ReplyAdapter(documentSnapshot);
    const intent = await reply.adapt();
    const dialogflowIntentCreatorAdapter = new DialogflowIntentCreatorAdapter(intent);
    const intentCreator = new IntentCreator(new DialogflowIntentCreator());
    return intentCreator.create(documentSnapshot.id, dialogflowIntentCreatorAdapter);
  });

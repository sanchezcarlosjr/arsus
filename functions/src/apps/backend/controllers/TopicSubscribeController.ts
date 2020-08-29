import * as functions from 'firebase-functions';
import { subscribeToTopicHandler } from '../../../handlers/subscribe-to-topic.handler';

export const subscribeToTopic = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onCall(subscribeToTopicHandler);

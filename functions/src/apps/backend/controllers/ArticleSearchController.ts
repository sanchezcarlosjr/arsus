import * as functions from 'firebase-functions';
import { searchHandler } from '../../../handlers/search.handler';

export const search = functions
  .runWith({
    timeoutSeconds: 35,
    memory: '2GB',
  })
  .https.onCall(searchHandler);

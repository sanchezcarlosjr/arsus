import * as functions from 'firebase-functions';
import { getNewsHandler } from '../../../handlers/get-news-handler';

export const getNews = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '2GB',
  })
  .https.onCall(getNewsHandler);

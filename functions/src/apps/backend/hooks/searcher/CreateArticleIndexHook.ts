import * as functions from 'firebase-functions';
import { createIndexByAlgoliaHandler } from '../../../../handlers/index-by-algolia.handler';

export const createIndexByAlgolia = functions
  .runWith({
    timeoutSeconds: 120,
    memory: '2GB',
  })
  .firestore.document('articles/{articleUID}')
  .onCreate(createIndexByAlgoliaHandler);

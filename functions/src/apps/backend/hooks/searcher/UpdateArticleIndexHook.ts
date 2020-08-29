import * as functions from 'firebase-functions';
import { updateIndexByAlgoliaHandler } from '../../../../handlers/index-by-algolia.handler';

export const updateIndexByAlgolia = functions
  .runWith({
    timeoutSeconds: 120,
    memory: '2GB',
  })
  .firestore.document('articles/{articleUID}')
  .onUpdate(updateIndexByAlgoliaHandler);

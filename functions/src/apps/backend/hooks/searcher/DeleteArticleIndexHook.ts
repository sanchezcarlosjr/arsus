import * as functions from 'firebase-functions';
import { deleteIndexByAlgoliaHandler } from '../../../../handlers/index-by-algolia.handler';

export const deleteIndexByAlgolia = functions
  .runWith({
    timeoutSeconds: 120,
    memory: '2GB',
  })
  .firestore.document('articles/{articlesUID}')
  .onDelete(deleteIndexByAlgoliaHandler);

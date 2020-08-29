import * as functions from 'firebase-functions';
import { updatePartnersIndexByAlgoliaHandler } from '../../../../handlers/index-partners-by-algolia.handler';

export const updatePartnerIndexByAlgolia = functions
  .runWith({
    timeoutSeconds: 40,
    memory: '2GB',
  })
  .firestore.document('users/{userUID}')
  .onUpdate(updatePartnersIndexByAlgoliaHandler);

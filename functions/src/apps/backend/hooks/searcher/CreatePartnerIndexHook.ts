import * as functions from 'firebase-functions';
import { createPartnerByAlgoliaHandler } from '../../../../handlers/index-partners-by-algolia.handler';

export const createPartnersIndexByAlgolia = functions
  .runWith({
    timeoutSeconds: 40,
    memory: '2GB',
  })
  .firestore.document('users/{userUID}')
  .onCreate(createPartnerByAlgoliaHandler);

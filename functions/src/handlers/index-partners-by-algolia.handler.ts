import algoliasearch from 'algoliasearch';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { EventContext, Change } from 'firebase-functions';

const client = algoliasearch(functions.config().algolia_partners.appid, functions.config().algolia_partners.apikey);
const index = client.initIndex(functions.config().algolia_partners.index);

export const createPartnerByAlgoliaHandler = async (documentSnapshot: DocumentSnapshot, context: EventContext) => {
  const userData = documentSnapshot.data();
  return index.saveObject({
    objectID: userData.uid,
    ...userData,
  });
};

export const updatePartnersIndexByAlgoliaHandler = async (change: Change<DocumentSnapshot>, context: EventContext) => {
  const data = change.after.data();
  const objectID = data.uid;
  return index.partialUpdateObject({
    objectID,
    ...data,
  });
};

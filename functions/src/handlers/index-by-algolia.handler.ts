import * as functions from 'firebase-functions';
import { Change, EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import algoliasearch from 'algoliasearch';
import { Database } from '../database/database';
import { Product } from '../providers/electronic-billing/product';

const client = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const index = client.initIndex(functions.config().algolia.index);

export const createIndexByAlgoliaHandler = async (documentSnapshot: DocumentSnapshot, context: EventContext) => {
  const articleData = documentSnapshot.data();
  await index.saveObject({
    objectID: articleData.uid,
    ...articleData,
  });
  const database = new Database();
  const enterpriseDocument = await database.collection('enterprises').show(articleData.enterpriseUID);
  const enterpriseData = enterpriseDocument.data();
  const facturapiKey = enterpriseData.services.facturapi.liveKey;
  return new Product(facturapiKey)
    .store({
      description: articleData.name,
      product_key: articleData.product_key || '81112106',
      unit_key: articleData.unit_key || 'H87',
      price: articleData.price,
      taxes: [
        {
          withholding: false,
          type: 'IVA',
          rate: 0.16,
        },
      ],
    })
    .then((response) =>
      database.collection('articles').update(articleData.uid, {
        services: {
          facturapi: response.id,
        },
      })
    );
};

export const updateIndexByAlgoliaHandler = async (change: Change<DocumentSnapshot>, context: EventContext) => {
  const data = change.after.data();
  const objectID = data.uid;
  await index.partialUpdateObject({
    objectID,
    ...data,
  });
  const database = new Database();
  const enterpriseDocument = await database.collection('enterprises').show(data.enterpriseUID);
  const enterpriseData = enterpriseDocument.data();
  const facturapiKey = enterpriseData.services.facturapi.liveKey;
  return await new Product(facturapiKey).update(data.services.facturapi, {
    description: data.name,
    product_key: data.product_key || '81112106',
    unit_key: data.unit_key || 'H87',
    price: data.price,
  });
};

export const deleteIndexByAlgoliaHandler = async (documentSnapshot: DocumentSnapshot, context: EventContext) => {
  const data = documentSnapshot.data();
  const objectID = data.uid;
  return index.deleteObject(objectID);
};

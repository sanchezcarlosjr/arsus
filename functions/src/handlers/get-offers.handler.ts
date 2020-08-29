import algoliasearch from 'algoliasearch';
import * as functions from 'firebase-functions';
import * as https from 'firebase-functions/lib/providers/https';

const client = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const index = client.initIndex(functions.config().algolia.index);

export interface SearchData {
  query: string;
  localization: { latitude: string; longitude: string };
}

export const getOffersHandler = async (body: SearchData | null, context: https.CallableContext) => {
  if (body.localization.latitude && body.localization.longitude) {
    return index.search('', {
      aroundRadius: 500,
      filters: `discountTotal > 0`,
      facetFilters: ['onSold:true'],
      aroundLatLng: `${body.localization.latitude}, ${body.localization.longitude}`,
    });
  }
  return index.search('', {
    aroundRadius: 500,
    filters: `discountTotal > 0`,
    facetFilters: ['onSold:true'],
    aroundLatLngViaIP: true,
  });
};

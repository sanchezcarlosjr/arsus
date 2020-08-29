import algoliasearch from 'algoliasearch';

const functions = require('firebase-functions');
const algoliaSearchClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const index = algoliaSearchClient.initIndex(functions.config().algolia.index);

export async function search(query: string, coords: { longitude?: number; latitude?: number }) {
  const response = await index.search(query, {
    aroundLatLng: `${coords.latitude}, ${coords.longitude}`,
  });
  return response.hits;
}

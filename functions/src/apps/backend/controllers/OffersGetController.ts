import * as functions from 'firebase-functions';
import { getOffersHandler } from '../../../handlers/get-offers.handler';

export const getOffers = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '2GB',
  })
  .https.onCall(getOffersHandler);

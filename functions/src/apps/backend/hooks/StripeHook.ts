import * as functions from 'firebase-functions';
import { stripeFulfilmentHandler } from '../../../handlers/stripe-fulfillment.handler';

export const stripeFulfilment = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '2GB',
  })
  .https.onRequest(stripeFulfilmentHandler);

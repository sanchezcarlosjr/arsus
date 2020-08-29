import * as functions from 'firebase-functions';
import { createOrderHandler } from '../../../handlers/create-order.handler';

export const createOrder = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '2GB',
  })
  .https.onCall(createOrderHandler);

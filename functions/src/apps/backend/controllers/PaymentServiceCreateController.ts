import * as functions from 'firebase-functions';
import { purchasePaymentServiceHandlerHandler } from '../../../handlers/purchase-payment-service.handler';

export const purchasePaymentService = functions
  .runWith({
    timeoutSeconds: 25,
    memory: '2GB',
  })
  .https.onCall(purchasePaymentServiceHandlerHandler);

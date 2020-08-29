import * as functions from 'firebase-functions';
import { cancelInvoiceHandler } from '../../../handlers/cancel-invoice.handler';

export const cancelInvoice = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onCall(cancelInvoiceHandler);

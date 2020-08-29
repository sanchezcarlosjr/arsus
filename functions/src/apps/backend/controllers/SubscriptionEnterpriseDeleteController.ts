import * as functions from 'firebase-functions';
import { enterpriseSubcriptionDeleteHandler } from '../../../handlers/enterprise-subscription-delete.handler';

export const subscriptionDelete = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '2GB',
  })
  .https.onCall(enterpriseSubcriptionDeleteHandler);

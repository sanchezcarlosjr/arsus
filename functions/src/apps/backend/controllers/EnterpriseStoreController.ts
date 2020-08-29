import * as functions from 'firebase-functions';
import { createNewEnterpriseHandler } from '../../../handlers/create-new-enterprise.handler';

export const createNewEnterprise = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '2GB',
  })
  .https.onCall(createNewEnterpriseHandler);

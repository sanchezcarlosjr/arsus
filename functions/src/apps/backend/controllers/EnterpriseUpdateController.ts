import * as functions from 'firebase-functions';
import { updateEnterpriseHandler } from '../../../handlers/update-enterprise-handler';

export const updateEnterprise = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '2GB',
  })
  .https.onCall(updateEnterpriseHandler);

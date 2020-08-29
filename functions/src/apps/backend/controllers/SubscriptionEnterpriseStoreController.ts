import * as functions from 'firebase-functions';
import { activeEnterpriseSubscriptionHandler } from '../../../handlers/active-enterprise-subscription-handler';

export const activeEnterpriseSubscription = functions
  .runWith({
    timeoutSeconds: 40,
    memory: '2GB',
  })
  .firestore.document('enterprises/{enterpriseId}')
  .onUpdate(activeEnterpriseSubscriptionHandler);

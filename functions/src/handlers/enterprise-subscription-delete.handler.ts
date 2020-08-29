import * as https from 'firebase-functions/lib/providers/https';

import { Database } from '../database/database';
import { identifyUser } from '../providers/profile';
import { StripeWrapper } from './../providers/stripe-wrapper';

export const enterpriseSubcriptionDeleteHandler = async (body: any, context: https.CallableContext) => {
  const userRecord = await identifyUser({
    userUID: context.auth.uid,
  });
  const database = new Database();
  const user = await database.collection('users').showData(userRecord.uid);
  const enterprise = await database.collection('enterprises').showData(user.enterpriseUID);
  const stripeWrapper = new StripeWrapper(null);
  const subscription = await stripeWrapper.getCostumer(enterprise.services.stripe.id);
  stripeWrapper.deleteSubscription(subscription.data[0].id);
  return database.collection('enterprises').update(user.enterpriseUID, {
    subscription: false,
  });
};

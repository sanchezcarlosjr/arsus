import { config, EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

import { Database } from '../database/database';
import { StripeWrapper } from '../providers/stripe-wrapper';

export const triggerBillingHandler = async (documentSnapshot: DocumentSnapshot, context: EventContext) => {
  const database = new Database();
  const user = await database.collection('users').showData(context.params.userId);
  const document = documentSnapshot.data();
  const stripeWrapper = new StripeWrapper({
    email: user[user.lastProvider].email,
    source: document.id,
    plan: config().stripe.planenterprisebasic,
  });
  return stripeWrapper.createSubscription();
};

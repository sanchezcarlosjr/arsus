import * as functions from 'firebase-functions';

import { Database } from '../database/database';
import { identifyUser } from '../providers/profile';

export const stripeFulfilmentHandler = async (request: functions.https.Request, response: functions.Response) => {
  switch (request.body.type) {
    case 'charge.succeeded':
      const data = request.body.data.object;
      const userRecord = await identifyUser({
        email: data.billing_details.email,
      });
      const database = new Database();
      const user = await database.collection('users').showData(userRecord.uid);
      return database.collection('enterprises').update(user.enterpriseUID, {
        subscription: true,
        services: {
          stripe: {
            id: data.costumer,
          },
        },
      });
    case 'payment_method.attached':
      const paymentMethod = request.body.object;
      console.log(paymentMethod);
      return null;
    default:
      return response.status(400).end();
  }
};

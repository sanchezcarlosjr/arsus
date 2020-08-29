import * as functions from 'firebase-functions';
import { notifyOrderHandler } from '../../../handlers/notify-order.handler';

export const notifyOrder = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .firestore.document('orders/{orderID}')
  .onUpdate(notifyOrderHandler);

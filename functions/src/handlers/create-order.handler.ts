import * as https from 'firebase-functions/lib/providers/https';
import { Order } from '../models/order';

export const createOrderHandler = async (body: any, context: https.CallableContext) => {
  return new Order(body, context.auth.uid).action();
};

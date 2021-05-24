import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';

export const updateDataUABC = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onCall(async (data: any, context: https.CallableContext) => {
    console.log(data);
    return {};
  });

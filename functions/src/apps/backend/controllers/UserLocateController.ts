import * as functions from 'firebase-functions';
import { locateUserHandler } from '../../../handlers/locate-user.handler';

export const locateUser = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '2GB',
  })
  .https.onCall(locateUserHandler);

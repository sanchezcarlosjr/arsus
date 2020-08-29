import * as functions from 'firebase-functions';
import * as https from 'firebase-functions/lib/providers/https';
import { UserLocation } from '../../../contexts/blog/users/infraestructure/user-location.model';

export const LocateUser = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '2GB',
  })
  .https.onCall(async (body: null, context: https.CallableContext) => {
    const location = new UserLocation(context.rawRequest);
    return location.store(context.auth.uid);
  });

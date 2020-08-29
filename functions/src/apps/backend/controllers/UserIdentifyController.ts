import * as functions from 'firebase-functions';
import { identifyUserHandler } from '../../../handlers/identify-user.handler';

export const identifyUser = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '2GB',
  })
  .firestore.document('enterprises/{enterpriseId}/STATEMENT_OF_INCOME/{statmentId}')
  .onCreate(identifyUserHandler);

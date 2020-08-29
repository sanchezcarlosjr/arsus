import * as functions from 'firebase-functions';
import { sendEmailHandler } from '../../../handlers/send-email.handler';

export const sendEmail = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '2GB',
  })
  .https.onCall(sendEmailHandler);

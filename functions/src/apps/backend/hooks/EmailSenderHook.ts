import * as functions from 'firebase-functions';
import * as express from 'express';
import { EmailPostWebHook } from '../../../contexts/email/infrastructure/EmailPostWebHook';

const app = express();

const emailPostWebHook = new EmailPostWebHook();
app.post('/', emailPostWebHook.run.bind(emailPostWebHook));

export const EmailSenderHook = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '8GB',
  })
  .https.onRequest(app);

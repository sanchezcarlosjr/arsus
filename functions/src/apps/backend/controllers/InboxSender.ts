import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { Database } from '../../../database/database';
import { Sendgrid } from '../../../contexts/email/infrastructure/Sendgrid';
import { Whatsapp } from '../../../contexts/blog/inbox/infraestructure/Whatsapp';

export const InboxSender = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onCall(async (data: any, context: https.CallableContext) => {
    const database = new Database();
    const user = await database.showData(context.auth.uid);
    if (!user.admin) {
      return 'No permission';
    }
    if (data.type === 'email') {
      const sendgrid = new Sendgrid();
      return sendgrid.send({
        to: data.to,
        subject: data.subject,
        text: data.message,
      });
    }
    if (data.type === 'whatsapp') {
      const whatsapp = new Whatsapp();
      return whatsapp.send({
        to: data.to,
        body: data.message,
      });
    }
    return 'unavailable';
  });

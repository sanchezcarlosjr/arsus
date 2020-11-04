import * as sgMail from '@sendgrid/mail';
import * as functions from 'firebase-functions';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { Database } from '../../../database/database';

sgMail.setApiKey(functions.config().sendgrid.key);

export const createNewUser = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '2GB',
  })
  .auth.user()
  .onCreate(async (userRecord: UserRecord, context: functions.EventContext) => {
    const user = {
      displayName: userRecord.providerData[0].displayName || '',
      email: userRecord.providerData[0].email || '',
      photoURL: userRecord.providerData[0].photoURL || '',
      phoneNumber: userRecord.providerData[0].phoneNumber || '',
      providerId: userRecord.providerData[0].providerId || '',
      uid: userRecord.uid,
      creationTime: userRecord.metadata.creationTime || '',
      lastSignInTime: userRecord.metadata.lastSignInTime || '',
      emailVerified: userRecord.emailVerified || false,
      isNewUser: false,
    };
    try {
      const database = new Database();
      await database.storeWith(userRecord.uid, user);
    } catch (e) {
      console.warn(e.message);
    }
    if (!user.emailVerified && user.providerId === 'firebase') {
      return new Promise((resolve) => resolve(''));
    }
    const name = user.displayName.split(' ')[0];
    const msg = {
      to: user.email,
      from: {
        name: 'Ana from Arsus',
        email: 'ana@sanchezcarlosjr.com',
      },
      templateId: 'd-516dd7d5d6034192b638dad09cb27bb6',
      dynamic_template_data: {
        response: `Hey ${name}. If you have any questions, please reply to this email. I’m always happy to help!`,
        subject: `${name}, do you need help?`,
      },
    };
    try {
      return await sgMail.send(msg);
    } catch (e) {
      console.log(e.message);
      return e;
    }
  });

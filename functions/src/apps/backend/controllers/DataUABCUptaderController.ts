import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { UABCScrapper } from '../../../contexts/uabc_scheduler/infraestructure/UABCScrapper';
import { GoogleCalendar } from '../../../contexts/uabc_scheduler/infraestructure/GoogleCalendar';
import admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

export const updateDataUABC = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onCall(async (data: any, context: https.CallableContext) => {
    const uabc = new UABCScrapper(data.email, data.password);
    const subjects = await uabc.scrape();
    const document = await admin
      .firestore()
      .collection(`users/${context.auth.uid}/credentials`)
      .orderBy('updated_at', 'desc')
      .get();
    const credentials = document.docs[0].data();
    const googleCalendar = new GoogleCalendar(credentials.google.accessToken, credentials.google.email, {
      startDate: new Date('2021-08-9'),
      endDate: new Date('2021-12-4'),
    });
    await Promise.all(googleCalendar.createSubjects(subjects));
    const msg = {
      to: credentials.google.email,
      from: {
        name: 'Ana desde Arsus',
        email: 'ana@sanchezcarlosjr.com',
      },
      templateId: 'd-516dd7d5d6034192b638dad09cb27bb6',
      dynamic_template_data: {
        response: `Hola, proceso completo. Ya puedes ver tu horario y el calendario UABC en https://calendar.google.com/calendar/`,
        subject: `De Calendario UABC a Google Calendar`,
      },
    };
    return await sgMail.send(msg);
  });

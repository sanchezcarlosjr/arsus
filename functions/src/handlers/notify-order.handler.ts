import { Change, EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import * as admin from 'firebase-admin';
import { OrderData } from '../models/order';
import * as sgMail from '@sendgrid/mail';

export const notifyOrderHandler = async (change: Change<DocumentSnapshot>, context: EventContext) => {
  const order: OrderData = <OrderData>change.after.data();
  const beforeOrder: OrderData = <OrderData>change.before.data();
  const userName = order.userName.split(' ')[0];
  let notification = {
    title: ` 😍 De ${beforeOrder.status} a ${order.status} `,
    body: `${userName}, tu compra cada vez más cerca 🤤`,
  };
  let title = '👉👉 ¿Qué podemos hacer por ti? 👈👈';
  let openUrl = 'https://arsuslife.com/home/h/orders';
  if (order.status == 'Listo') {
    notification = {
      title: `${userName}, gracias por tu compra!`,
      body: `📪 ¿Cómo podemos mejorar tu experiencia? 📪`,
    };
    title = '📲 Dejanos tu opinión en Facebook';
    openUrl = 'https://www.facebook.com/ArsusLife/reviews/';
    const msg = {
      to: order.email,
      from: {
        name: 'Carlos de Arsus',
        email: 'carlos@arsus.com',
      },
      templateId: 'd-af541175d5ff45a587b1c8ebcccd2a79',
      dynamic_template_data: {
        name: userName,
      },
    };
    await sgMail.send(msg);
  }
  const payload: admin.messaging.Message = {
    notification,
    webpush: {
      notification: {
        vibrate: [200, 100, 200],
        icon:
          'https://firebasestorage.googleapis.com/v0/b/arsus-production.appspot.com/o/logo-transparent.png?alt=media&token=485a5c1c-a436-41f7-b126-57c6e3ce75bb',
        actions: [
          {
            action: 'accept',
            title,
          },
        ],
        openUrl,
        requireInteraction: true,
        badge:
          'https://firebasestorage.googleapis.com/v0/b/arsus-production.appspot.com/o/logo-transparent.png?alt=media&token=485a5c1c-a436-41f7-b126-57c6e3ce75bb',
      },
    },
    topic: `arsus-life${order.userUID}`,
  };
  return admin.messaging().send(payload);
};

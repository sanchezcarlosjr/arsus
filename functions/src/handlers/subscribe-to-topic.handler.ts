import * as https from 'firebase-functions/lib/providers/https';
import * as admin from 'firebase-admin';
import { UserDevice } from '../contexts/blog/users/infraestructure/user-device.model';

export interface TopicData {
  token: string;
  topic: string;
  device: any;
}

export const subscribeToTopicHandler = async (body: TopicData | null, context: https.CallableContext) => {
  const topic = `${body.topic}${context.auth.uid}`;
  await admin.messaging().subscribeToTopic(body.token, topic);
  return new Promise((resolve) => resolve(`subscribed to ${topic}`)).then(() => {
    const device = new UserDevice(
      {
        ...body.device,
        token: body.token,
        topic: body.topic,
      },
      context.rawRequest
    );
    return device.store(context.auth.uid);
  });
};

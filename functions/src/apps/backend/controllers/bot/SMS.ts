import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { Response } from 'express';
import { Dialogflow } from '../../../../contexts/email/infraestructure/Dialogflow';
import { TelecommunicationCreator } from '../../../../contexts/blog/bot/application/TelecommunicationCreator';
import { FirestoreCommunicationStoreRepository } from '../../../../contexts/email/infraestructure/FirestoreCommunicationStoreRepository';

export interface BodyTwilio {
  SmsMessageSid: string;
  NumMedia: string;
  SmsSid: string;
  SmsStatus: string;
  Body: string;
  To: string;
  NumSegments: string;
  MessageSid: string;
  AccountSid: string;
  From: string;
  ApiVersion: string;
}

export const SMS = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onRequest(async (request: https.Request, response: Response) => {
    const body: BodyTwilio = request.body;
    const telecommunicationCreator = new TelecommunicationCreator(new Dialogflow());
    const xml: string = await telecommunicationCreator.create(body.Body, body.From);
    response.setHeader('Content-Type', 'text/xml');
    response.send(xml);
    const firestoreCommunicationStoreRepository = new FirestoreCommunicationStoreRepository();
    return firestoreCommunicationStoreRepository.save({
      from: body.From,
      to: body.To,
      body: body.Body,
      extra: {
        ...body,
      },
    });
  });

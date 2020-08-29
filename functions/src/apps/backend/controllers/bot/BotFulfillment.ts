import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { Response } from 'express';
import { Agent } from '../../../../contexts/email/infraestructure/webhook-client';
import admin from 'firebase-admin';

const { WebhookClient } = require('dialogflow-fulfillment');
process.env.DEBUG = 'dialogflow:debug';

export const BotFulfillment = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onRequest((request: https.Request, response: Response) => {
    const webhookClient = new WebhookClient({ request, response });
    function login(agent: Agent) {
      agent.add('');
      const patternSessionPhone = agent.session.match(/^\+(?:[0-9] ?){6,14}[0-9]$/);
      const phoneNumber = patternSessionPhone ? patternSessionPhone[0] : undefined;
      admin
        .auth()
        .createUser({
          email: agent.parameters.email,
          emailVerified: false,
          password: '1234567',
          phoneNumber,
          displayName: 'NiceGuy',
          disabled: false,
        })
        .then(() => console.log('New user created by Bot'))
        .catch((e) => console.log(e.message));
    }
    const intentMap = new Map();
    intentMap.set('email', login);
    return webhookClient.handleRequest(intentMap);
  });

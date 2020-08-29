import * as functions from 'firebase-functions';
const client = require('twilio')(functions.config().twillio.account_sid, functions.config().twillio.auth_token);

export class Whatsapp {
  constructor() {}

  async send(message: { to: string; body: string }) {
    try {
      await client.messages.create({ body: message.body, from: 'whatsapp:+12563877509', to: `whatsapp:${message.to}` });
    } catch (e) {
      console.warn(e);
    }
  }
}

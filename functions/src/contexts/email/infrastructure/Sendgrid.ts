import { Email, EmailSendRepository } from '../domain/EmailSendRepository';
import * as sgMail from '@sendgrid/mail';

import * as functions from 'firebase-functions';

sgMail.setApiKey(functions.config().sendgrid.key);

export class Sendgrid implements EmailSendRepository {
  constructor() {}
  async send(email: Email): Promise<void> {
    const msg = {
      to: email.to,
      from: {
        name: 'Ana from Carlos',
        email: 'ana@sanchezcarlosjr.com',
      },
      templateId: 'd-516dd7d5d6034192b638dad09cb27bb6',
      dynamic_template_data: { response: email.text, subject: `Response to ${email.subject}` },
    };
    await sgMail.send(msg);
  }
}

import { Email } from '../domain/EmailSendRepository';
import { EmailFrom } from '../domain/EmailFrom';
import { EmailText } from '../domain/EmailText';
import { EmailBody } from '../domain/EmailBody';
import { warn } from '../../shared/Error';
import * as express from 'express';
import { FirestoreTypeCommunicationFinderRepository } from '../infrastructure/FirestoreTypeCommunicationFinderRepository';
import { CloudFunctionsIncomeEmailStrategyMaker } from '../infrastructure/CloudFunctionsIncomeEmailStrategyMaker';

const formidable = require('formidable-serverless');

export class InboundEmail {
  private emailData: Email = {
    from: '',
    to: '',
    subject: '',
    text: '',
    body: '',
  };

  constructor(private from: EmailFrom, subject: string, text: EmailText, body: EmailBody, to: string) {
    this.emailData.from = from.value;
    this.emailData.text = text.value;
    this.emailData.subject = subject;
    this.emailData.body = body.value;
    this.emailData.to = to;
  }

  static async parse(request: express.Request): Promise<InboundEmail> {
    return new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(request, (errors: any, fields: any) => {
        if (errors !== null) {
          reject(errors);
          return;
        }
        resolve(
          new InboundEmail(
            new EmailFrom(
              fields.from,
              new FirestoreTypeCommunicationFinderRepository(),
              new CloudFunctionsIncomeEmailStrategyMaker()
            ),
            fields.subject,
            new EmailText(fields.text, fields.subject),
            new EmailBody(fields.html),
            fields.to
          )
        );
      });
    });
  }

  async doStrategy() {
    try {
      const strategy = await this.from.makeStrategy();
      await strategy.execute(this.emailData);
    } catch (e) {
      warn('InboundEmail', 29, e.message, 'Income Email Making');
    }
  }
}

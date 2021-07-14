import * as express from 'express';
import { InboundEmail } from '../application/InboundEmail';
import { EmailFrom } from '../domain/EmailFrom';
import { EmailText } from '../domain/EmailText';
import { FirestoreTypeCommunicationFinderRepository } from './FirestoreTypeCommunicationFinderRepository';
import { CloudFunctionsIncomeEmailStrategyMaker } from './CloudFunctionsIncomeEmailStrategyMaker';
import { EmailBody } from '../domain/EmailBody';
import { warn } from '../../shared/Error';

const formidable = require('formidable-serverless');

export class EmailPostWebHook {
  private form = new formidable.IncomingForm();
  private incomeEmail: InboundEmail;

  async run(request: express.Request, res: express.Response) {
    try {
      this.parse(request);
      await this.incomeEmail.doStrategy();
    } catch (e) {
      warn('EmailPostWebHook', 21, e.message, 'Income Email Parsing');
    }
    return res.sendStatus(200);
  }

  private parse(request: express.Request) {
    this.form.parse(request, (errors: any, fields: any) => {
      if (errors !== undefined) {
        console.log(errors);
        throw Error(errors);
      }
      this.incomeEmail = new InboundEmail(
        new EmailFrom(
          fields.from,
          new FirestoreTypeCommunicationFinderRepository(),
          new CloudFunctionsIncomeEmailStrategyMaker()
        ),
        fields.subject,
        new EmailText(fields.text, fields.subject),
        new EmailBody(fields.html),
        fields.to
      );
    });
  }
}

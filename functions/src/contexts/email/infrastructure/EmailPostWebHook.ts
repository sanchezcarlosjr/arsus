import * as express from 'express';
import { warn } from '../../shared/Error';
import { InboundEmail } from '../application/InboundEmail';

export class EmailPostWebHook {
  async run(request: express.Request, res: express.Response) {
    try {
      const incomeEmail = await InboundEmail.parse(request);
      await incomeEmail.doStrategy();
    } catch (e) {
      warn('EmailPostWebHook', 21, e.message, 'Income Email Parsing');
    }
    return res.sendStatus(200);
  }
}

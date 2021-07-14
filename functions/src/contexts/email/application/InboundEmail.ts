import { Email } from '../domain/EmailSendRepository';
import { EmailFrom } from '../domain/EmailFrom';
import { EmailText } from '../domain/EmailText';
import { EmailBody } from '../domain/EmailBody';
import { warn } from '../../shared/Error';

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

  async doStrategy() {
    try {
      const strategy = await this.from.makeStrategy();
      await strategy.execute(this.emailData);
    } catch (e) {
      warn('InboundEmail', 29, e.message, 'Income Email Making');
    }
  }
}

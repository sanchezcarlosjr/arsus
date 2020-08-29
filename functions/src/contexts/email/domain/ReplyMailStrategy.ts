import { Email, EmailSendRepository } from './EmailSendRepository';
import { NaturalProcessorLanguage } from './NaturalProcessorLanguage';
import { CommunicationStoreRepository } from './CommunicationStoreRepository';
import { NoReplyMailStrategy } from './NoReplyMailStrategy';
import { IncomeEmailStrategy } from '../application/IncomeEmailStrategy';

export class ReplyMailStrategy extends NoReplyMailStrategy implements IncomeEmailStrategy {
  constructor(
    communicationStoreRepository: CommunicationStoreRepository,
    private emailSender: EmailSendRepository,
    private naturalProcessorLanguage: NaturalProcessorLanguage
  ) {
    super(communicationStoreRepository);
  }

  async execute(email: Email): Promise<void> {
    await super.execute(email);
    try {
      const text = await this.naturalProcessorLanguage.detectIntent(email.text, email.from);
      return await this.emailSender.send({ text, to: email.from, subject: email.subject });
    } catch (e) {
      console.log(e);
    }
  }
}

import { CommunicationStoreRepository } from './CommunicationStoreRepository';
import { Email } from './EmailSendRepository';
import { IncomeEmailStrategy } from '../application/IncomeEmailStrategy';

export class NoReplyMailStrategy implements IncomeEmailStrategy {
  constructor(private communicationStoreRepository: CommunicationStoreRepository) {}

  async execute(email: Email) {
    await this.communicationStoreRepository.save({
      from: email.from,
      to: email.to,
      body: email.body,
    });
  }
}

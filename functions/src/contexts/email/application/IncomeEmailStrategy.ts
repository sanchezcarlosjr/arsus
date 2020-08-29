import { Email } from '../domain/EmailSendRepository';

export interface IncomeEmailStrategy {
  execute: (email: Email) => Promise<void>;
}

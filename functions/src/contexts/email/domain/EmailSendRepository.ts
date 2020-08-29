export interface Email {
  from?: string;
  to: string;
  subject: string;
  text: string;
  body?: string;
}

export interface EmailSendRepository {
  send(email: Email): Promise<void>;
}

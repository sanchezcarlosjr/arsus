import * as admin from 'firebase-admin';
import { Command } from '../application/CommandBatch';

export class QuotaCounter implements Command {
  constructor(private apiKey: string) {}
  execute() {
    const date = new Date();
    const ref = admin
      .firestore()
      .collection(`users/${this.apiKey}/quota`)
      .doc(`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`);
    return ref.update('quota', admin.firestore.FieldValue.increment(1)).catch(() =>
      ref.set({
        quota: 1,
      })
    );
  }
}

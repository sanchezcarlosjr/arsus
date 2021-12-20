import { Command } from '../application/CommandBatch.js';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

export class QuotaCounter implements Command {
  constructor(private apiKey: string) {}

  execute() {
    const date = new Date();
    const ref = getFirestore()
      .collection(`users/${this.apiKey}/quota`)
      .doc(`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`);
    return ref.update('quota', FieldValue.increment(1)).catch(() =>
      ref.set({
        quota: 1,
      })
    );
  }
}

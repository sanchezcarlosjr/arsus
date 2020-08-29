import * as admin from 'firebase-admin';
import { NewsRepository } from '../application/NewsRepository';
import { Article } from '../domain/Article';

export class FirestoreNewsSaveRepository implements NewsRepository {
  private firestore: FirebaseFirestore.Firestore = admin.firestore();

  async save(articles: Article[]): Promise<void> {
    const batch = this.firestore.batch();
    articles.forEach((article) => {
      const ref = this.firestore.collection('content').doc();
      batch.set(ref, {
        ...article,
        uid: ref.id,
        created_at: new Date(),
      });
    });
    await batch.commit();
  }
}

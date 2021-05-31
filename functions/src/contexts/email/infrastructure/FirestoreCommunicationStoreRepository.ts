import { Database } from '../../../database/database';
import { Communication, CommunicationStoreRepository } from '../domain/CommunicationStoreRepository';

export class FirestoreCommunicationStoreRepository implements CommunicationStoreRepository {
  private database = new Database();

  async save(communication: Communication): Promise<void> {
    try {
      await this.database.collection('communication').store(communication);
    } catch (e) {
      console.warn(e);
    }
  }
}

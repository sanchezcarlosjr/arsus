import { Database } from '../../../database/database';
import { TypeCommunicationFinderRepository } from '../domain/TypeCommunicationFinderRepository';

export class FirestoreTypeCommunicationFinderRepository implements TypeCommunicationFinderRepository {
  private database = new Database();
  private noReplyPattern: RegExp = new RegExp('noreply|no-reply|hello|promotions|confirm');

  async find(id: string): Promise<string> {
    const communicationTypes = await this.database.collection('sources').exits(id);
    if (communicationTypes) {
      return 'content';
    }
    if (this.noReplyPattern.test(id)) {
      return 'no-reply';
    }
    return '';
  }
}

import { TypeCommunicationFinderRepository } from '../domain/TypeCommunicationFinderRepository';
import { Database } from '../../../database/database';

export class FirestoreTypeCommunicationFinderRepository implements TypeCommunicationFinderRepository {
  private database = new Database();
  private noReplyPattern: RegExp = new RegExp('noreply|no-reply|hello|promotions|confirm');

  async find(id: string): Promise<string> {
    const communicationTypes = await this.database.collection('TypeCommunication').whereData('id', '==', id);
    if (communicationTypes.length > 0 && communicationTypes[0].type === 'content') {
      return 'content';
    }
    if (this.noReplyPattern.test(id)) {
      return 'no-reply';
    }
    return '';
  }
}

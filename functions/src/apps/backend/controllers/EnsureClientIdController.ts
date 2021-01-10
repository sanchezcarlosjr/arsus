import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { Database } from '../../../database/database';
import { StringObject } from './../../../helpers/StringObject';

const database = new Database();

interface ClientIdRequest {
  client_id: string;
  redirect_uri: string;
}

class ClientId extends StringObject {
  constructor(clientId: string, private database: Database) {
    super(clientId);
    this.ensure().then();
  }
  private async ensure() {
    const exists = await this.database.exits(this._value);
    if (!exists) {
      throw new Error('client_id not exists');
    }
  }
}

class RedirectURI extends StringObject {
  constructor(redirect_uri: string, private database: Database) {
    super(redirect_uri);
  }
  async ensure(clientId: ClientId) {
    const user = await this.database.showData(clientId.value);
    if (!user.authorizedRedirectURIs.match(this._value)) {
      throw new Error('uri forbidden');
    }
  }
}

export const ensureClientId = functions
  .runWith({
    timeoutSeconds: 70,
    memory: '2GB',
  })
  .https.onCall(async (request: ClientIdRequest, context: https.CallableContext) => {
    try {
      const clientId = new ClientId(request.client_id, database);
      const redirectURI = new RedirectURI(request.redirect_uri, database);
      await redirectURI.ensure(clientId);
      return true;
    } catch (error) {
      return false;
    }
  });

import * as admin from 'firebase-admin';
import { Database } from '../../../../database/database';

export class UserDevice {
  private readonly device: any;
  private database = new Database();
  constructor(bodyDevice: any, rawRequest: any) {
    this.device = {
      userAgent: rawRequest.header('user-agent'),
      ...bodyDevice,
    };
  }

  public async store(userUID: string) {
    if (this.device.uuid) {
      return this.database.collection(`users/${userUID}/devices`).storeAndUpdateWith(this.device.uuid, this.device);
    } else {
      return admin.firestore().collection(`users/${userUID}/devices`).add(this.device);
    }
  }
}

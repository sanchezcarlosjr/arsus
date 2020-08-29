import { Database } from '../../../../database/database';

export interface UserData {
  google?: any;
  twitter?: any;
  isNewUser: boolean;
  emailVerified: boolean;
  creationTime: string;
  lastSignInTime: string;
  uid: string;
  isAnonymous: boolean;
  lastProvider: string;
  app: string;
}

export class User {
  protected database = new Database();
  private collection = 'users';

  constructor(private user: UserData) {}

  store() {
    return this.database.collection(this.collection).storeWith(this.user.uid, this.user);
  }
}

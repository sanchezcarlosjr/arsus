import { OAuth2Client } from 'google-auth-library';
import * as admin from 'firebase-admin';
import { Database } from '../database/database';
import * as firebase from 'firebase';
import { User } from '../contexts/blog/users/application/user';

const functions = require('firebase-functions');

export async function identifyUser(data: {
  phoneNumber?: string;
  email?: string;
  userName?: string;
  userUID?: string;
}) {
  let userByEmail = undefined;
  let userByPhone = undefined;
  let userByUserName = undefined;
  let userByUserUID = undefined;
  if (!!data.email && data.email !== '') {
    userByEmail = await admin.auth().getUserByEmail(data.email);
  }
  if (!!data.phoneNumber && data.phoneNumber !== '') {
    userByPhone = await admin.auth().getUserByPhoneNumber(data.phoneNumber);
  }
  if (!!data.userUID && data.userUID !== '') {
    userByUserUID = await admin.auth().getUser(data.userUID);
  }
  if (!!data.userName && data.userName) {
    const database = new Database();
    const document = await database.collection('dictionary-by-search-user-name').showData(data.userName);
    userByUserName = await admin.auth().getUser(document.userUID);
  }
  return userByUserName || userByEmail || userByPhone || userByUserUID;
}

async function createUser(token: string) {
  const credential = firebase.auth.GoogleAuthProvider.credential(token);
  const userCredential = await firebase.auth().signInWithCredential(credential);
  const providerId = userCredential.additionalUserInfo.providerId.split('.')[0];
  const user = new User({
    isNewUser: userCredential.additionalUserInfo.isNewUser,
    emailVerified: userCredential.user.emailVerified,
    creationTime: userCredential.user.metadata.creationTime,
    lastSignInTime: userCredential.user.metadata.lastSignInTime,
    uid: userCredential.user.uid,
    isAnonymous: userCredential.user.isAnonymous,
    lastProvider: providerId,
    app: 'life',
    [`${providerId}`]: {
      ...userCredential.credential,
      ...userCredential.user.providerData[0],
      photoURL: userCredential.user.photoURL,
      ...userCredential.additionalUserInfo.profile,
    },
  });
  await user.store();
  return await admin.auth().getUserByEmail(userCredential.user.email);
}

export class Profile {
  private name: string;
  private uid: string;

  constructor(private token: string) {}

  private async where(value: string) {
    const response = await identifyUser({
      email: value,
    });
    const userRecord = response || (await createUser(this.token));
    return userRecord.uid;
  }

  getUID() {
    return this.uid;
  }

  async request() {
    const CLIENT_ID = functions.config().google.client_id;
    const client = new OAuth2Client(CLIENT_ID);
    const login = await client.verifyIdToken({
      idToken: this.token,
      audience: CLIENT_ID,
    });
    const payload = login.getPayload();
    this.name = payload.name.split(' ')[0];
    this.uid = await this.where(payload.email);
  }

  getName() {
    return this.name;
  }
}

export async function profile(token: string) {
  const CLIENT_ID = functions.config().google.client_id;
  const client = new OAuth2Client(CLIENT_ID);
  const login = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  return login.getPayload();
}

export async function user(token: string) {
  const payload = await profile(token);
  const userRecord = await admin.auth().getUserByEmail(payload.email);
  const database = new Database();
  return await database.collection('users').showData(userRecord.uid);
}

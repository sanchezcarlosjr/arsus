import * as admin from 'firebase-admin';

const functions = require('firebase-functions');

export const UpdateUserController = functions.firestore
  .document('users/{userUID}')
  .onUpdate((change: any, context: any) => {
    const data = change.after.data();
    const phoneNumber = data.phoneNumber ? data.phoneNumber : undefined;
    return admin.auth().updateUser(change.after.id, {
      displayName: data.displayName,
      email: data.email,
      photoURL: data.photoURL,
      phoneNumber,
    });
  });

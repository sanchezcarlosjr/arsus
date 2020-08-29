import admin from 'firebase-admin';

export async function ensureIsValidApiKey(apiKey: string) {
  if (!apiKey) {
    throw new Error(`${apiKey} is a invalid API Key. You need to sign up on https://sanchezcarlosjr.com`);
  }
  const existsApiKey: boolean = await admin
    .firestore()
    .doc(`users/${apiKey}`)
    .get()
    .then((document) => document.exists);
  if (!existsApiKey) {
    throw new Error(`Api key '${apiKey}' not found. You need to sign up on https://sanchezcarlosjr.com`);
  }
}

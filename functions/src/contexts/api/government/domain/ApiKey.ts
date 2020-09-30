import admin from 'firebase-admin';

export async function ensureIsValidApiKey(apiKey: string) {
  if (!apiKey) {
    throw new Error(`invalid API Key`);
  }
  await admin.auth().getUser(apiKey);
}

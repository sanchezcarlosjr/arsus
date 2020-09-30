import admin from 'firebase-admin';

export async function ensureIsValidApiKey(apiKey: string) {
  if (!apiKey) {
    throw new Error(`invalid API Key. You need to sign up on https://sanchezcarlosjr.com`);
  }
  await admin
    .auth()
    .getUser(apiKey)
    .catch(() => `Api key '${apiKey}' not found. You need to sign up on https://sanchezcarlosjr.com`);
}

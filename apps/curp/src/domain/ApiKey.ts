import { getAuth } from 'firebase-admin/auth';

export async function ensureIsValidApiKey(apiKey: string) {
  if (!apiKey) {
    throw new Error(`invalid API Key`);
  }
  await getAuth().getUser(apiKey);
}

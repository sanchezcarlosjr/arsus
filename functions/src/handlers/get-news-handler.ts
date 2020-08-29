import * as https from 'firebase-functions/lib/providers/https';

export const getNewsHandler = async (body: string | null, context: https.CallableContext) => {
  return body;
};

import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';

export const validateINE = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onCall(async (data: any, context: https.CallableContext) => {
    console.log(data);
    return {
      isValidINE: true,
      url: 'https://listanominal.ine.mx/scpln/images/credencial-modeloEG.png',
    };
  });

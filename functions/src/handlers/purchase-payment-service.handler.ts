import * as https from 'firebase-functions/lib/providers/https';

const request = require('request-promise');

export interface PurchasePaymentServiceData {
  phoneNumber: string;
  article: string;
}

export const purchasePaymentServiceHandlerHandler = async (
  body: PurchasePaymentServiceData | null,
  context: https.CallableContext
) => {
  const options = {
    method: 'POST',
    uri: 'https://taecel.com/app/api/RequestTXN',
    headers: {
      'cache-control': 'no-cache',
      Connection: 'keep-alive',
      'content-length': '99',
      'accept-encoding': 'gzip, deflate',
      Host: 'taecel.com',
      'Cache-Control': 'no-cache',
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      key: '',
      nip: '',
      producto: body.article,
      referencia: body.phoneNumber,
    },
  };
  return await request(options);
};

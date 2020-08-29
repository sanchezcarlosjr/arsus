import * as https from 'firebase-functions/lib/providers/https';

import { Database } from '../database/database';
import { Invoice } from '../providers/electronic-billing/invoice';

export const cancelInvoiceHandler = async (
  body: { invoiceID: string; enterpriseUID: string; orderID: string },
  context: https.CallableContext
) => {
  const database = new Database();
  const enterpriseData = await database.collection('enterprises').showData(body.enterpriseUID);
  const invoice = new Invoice(enterpriseData.services.facturapi.liveKey);
  return await invoice.cancelInvoice(body.invoiceID);
};

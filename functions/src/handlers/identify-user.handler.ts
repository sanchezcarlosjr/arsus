import { firestore } from 'firebase-admin';
import { EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

import { Database } from '../database/database';
import { Order } from '../models/order';
import { Client } from '../providers/electronic-billing/client';
import { Invoice } from '../providers/electronic-billing/invoice';
import { identifyUser } from '../providers/profile';

interface DocumentData {
  uid: string;
  balance: number;
  created_at: Date;
  phoneNumber: string;
  employeeUID: string;
  email: string;
  paymentMethod: string;
  _geoloc: { lat: number; lng: number };
  accountGroupingCodeSat: string;
}

export const identifyUserHandler = async (documentSnapshot: DocumentSnapshot, context: EventContext) => {
  const data: DocumentData = documentSnapshot.data() as DocumentData;
  const database = new Database();
  await database
    .collection(`enterprises/${context.params.enterpriseId}/STATEMENT_OF_INCOME`)
    .update('0', { numberOfDocs: firestore.FieldValue.increment(1) });
  const userRecord = await identifyUser(data);
  if (data.balance > 0 && userRecord) {
    const enterpriseUID = context.params.enterpriseId;
    const statementUID = context.params.statmentId;
    const response = await database.collection('enterprises').show(enterpriseUID);
    const enterpriseData = response.data();
    const client = new Client(enterpriseData.services.facturapi.liveKey);
    const clientID = await client.store(userRecord.uid, enterpriseUID);
    const payment = data.paymentMethod;
    const employee = await database.collection('users').showData(data.employeeUID);
    const employeeName = employee.displayName;
    const photoURL = employee.photoURL;
    const body = {
      ...data,
      address: `${enterpriseData.address.street}  ${enterpriseData.address.zip} ${enterpriseData.address.city} ${enterpriseData.address.exterior}`,
      time: `Compra en ${enterpriseData.enterpriseName}`,
      userUID: userRecord.uid,
      status: 'Listo',
      priority: 'low',
      driverVehicle: 'N/A',
      total: `$${data.balance}`,
      saving: '$0',
      payment,
      enterpriseName: enterpriseData.enterpriseName,
      driverName: employeeName,
      delivery: '$0',
      enterpriseUID,
      driverUID: employee.uid,
      driverPhotoURL: photoURL,
      statementUID,
    };
    const order = new Order(body, userRecord.uid);
    const document = await order.actionWithoutNotification();
    return new Promise((resolve) => {
      setTimeout(async () => {
        const articles = await database
          .collection(`enterprises/${enterpriseUID}/STATEMENT_OF_INCOME/${statementUID}/articles`)
          .index();
        order.storeArticles(articles, document.id);
        if (!enterpriseData.subscription) {
          resolve(null);
          return null;
        }
        const invoice = new Invoice(enterpriseData.services.facturapi.liveKey);
        const items = articles.map((article) => {
          return {
            quantity: article.amount,
            product: article.services.facturapi,
          };
        });
        const result = await invoice.store({
          costumer: clientID.id,
          items,
          payment,
        });
        await invoice.upload(userRecord.uid, document.id);
        resolve(result);
      }, 4000);
    });
  }
  return null;
};

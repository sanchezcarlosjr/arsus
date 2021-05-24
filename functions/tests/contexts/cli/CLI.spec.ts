import admin from 'firebase-admin';
import * as mocha from 'mocha';
import { AdminWrapper } from '../../AdminWrapper';
import { MexicanFinder } from './../../../src/contexts/api/government/application/MexicanFinder';
import { CurpResponse } from './../../../src/contexts/api/government/domain/CurpResponse';
import { warnByAPI } from '../../../src/contexts/shared/Error';

export class Transaction {
  private db = admin.firestore();
  private mexicanFinder = new MexicanFinder();
  transacte(
    query: FirebaseFirestore.Query
  ): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> {
    let lastDocument: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = null;
    return this.db
      .runTransaction((t) =>
        t.get(query).then((snapshot) => {
          lastDocument = snapshot.docs[
            snapshot.docs.length - 1
          ] as FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
          return snapshot.docs.reduce(async (previousPromise, actual) => {
            await previousPromise;
            const response = await this.mexicanFinder.find(actual.data() as CurpResponse);
            t.update(actual.ref, response);
          }, Promise.resolve());
        })
      )
      .then(() => lastDocument);
  }
  transacteAll(query: FirebaseFirestore.Query) {
    return this.db.runTransaction((t) =>
      t.get(query).then((snapshot) => {
        snapshot.docs.forEach(async (doc) => {
          const data = (await this.db.collection('id').where('nss', '==', doc.id).get()).docs[0].data();
          return t.update(doc.ref, {
            mexicanName: `${data.name} ${data.fatherName} ${data.motherName}`,
          });
        });
      })
    );
  }
}

export class Batch {
  private db = admin.firestore();
  private actual = this.db.collection('id').orderBy('curp').limit(5);
  private lastDocument: string;
  getQuery() {
    return this.actual;
  }
  set _lastDocument(lastDocument: string) {
    this.lastDocument = lastDocument;
  }
  next() {
    this.actual = this.db.collection('id').orderBy('curp').startAfter(this.lastDocument).limit(5);
  }
}

mocha.describe('Download mexican key data', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it('infonavit collection', async () => {
    const transaction = new Transaction();
    await transaction.transacteAll(admin.firestore().collection('infonavit'));
  });
  it('Admin CLI', async () => {
    const transaction = new Transaction();
    const startAfter = '';
    let document = await admin.firestore().collection('id').doc(startAfter).get();
    while (document) {
      let query = admin.firestore().collection('id').orderBy('curp', 'desc').startAfter(document).limit(20);
      try {
        document = await transaction.transacte(query).catch(() => transaction.transacte(query));
      } catch (e) {
        if (e.message === '3 INVALID_ARGUMENT: The referenced transaction has expired or is no longer valid.') {
          warnByAPI(
            'Transaction',
            15,
            'The referenced transaction has expired or is no longer valid.',
            'FIRESTORE LIBRARY'
          );
        }
      }
    }
  });
});

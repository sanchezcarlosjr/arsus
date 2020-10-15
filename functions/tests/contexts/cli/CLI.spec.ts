import admin from 'firebase-admin';
import * as mocha from 'mocha';
import { AdminWrapper } from '../../AdminWrapper';
import { MexicanFinder } from './../../../src/contexts/api/government/application/MexicanFinder';
import { CurpResponse } from './../../../src/contexts/api/government/domain/CurpResponse';

class Batch {
  private db = admin.firestore();
  private actual = this.db.collection('id')
      .orderBy('curp')
      .limit(3);
  private last: any;
  async getDocs() {
    const snapshot = await this.actual.get();
    this.last = snapshot.docs[snapshot.docs.length - 1];
    return snapshot.docs.filter((doc) => !doc.data().rfc).map((doc) => doc.data() as CurpResponse);
  }
  next() {
    this.actual = this.db.collection('id')
      .orderBy('curp')
      .startAfter(this.last.data().curp)
      .limit(3);
  }
  log() {
    console.log(this.last.data().curp);
  }
}


function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



mocha.describe('CLI', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it('Admin CLI', async () => { 
   const batch = new Batch();
   const mexicanFinder = new MexicanFinder();
    while(true) {
      let mexicans = await batch.getDocs();
      mexicans.forEach(async(mexican: CurpResponse) => {
          try {
            await mexicanFinder.find(mexican);
            await timeout(200000);
          } catch (e) {
              batch.log();
              console.warn(e.message);
              console.log(mexican);
          }
      });
      batch.next();
    }      
  });
});
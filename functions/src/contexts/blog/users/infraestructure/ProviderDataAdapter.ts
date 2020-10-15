import admin from 'firebase-admin';
import { get } from 'request-promise';
import { Database } from '../../../../database/database';


export interface SourceNews {
  name: string; 
  id: string;
  type: string;
} 
export interface ProviderDataAdaptable {
  createOptionsFor: (tokenUID: any) => { uri: string; qs?: any; headers?: any; auth?: any; json: boolean };
  map: (providerResponse: any) => SourceNews[];
}

export class BatchFirestoreRepository {
  private firestore: FirebaseFirestore.Firestore = admin.firestore();
  async save<T extends {id: string}>(
            documents: T[],
            path: (document: any) => string,
            map: (document: any) => any = (document) => document
          ): Promise<void> {
    const batch = this.firestore.batch();
    documents.forEach((document) => {
      const ref = this.firestore.doc(path(document));
      batch.set(ref, map(document));
    });
    await batch.commit();
  }
}

export class Source {
   async save(subscriptions: SourceNews[], userUID: string) {
    const batchRepository = new BatchFirestoreRepository();
    await batchRepository.save<SourceNews>(subscriptions, (document) => `sources/${document.id}`, (document) => {
      return {
        ...document,
        subscribers: admin.firestore.FieldValue.arrayUnion(userUID)
      }
    });
   }
}

export class ProviderDataAdapter {

  constructor(private userUID: string, private tokenUID: any) {}

  async adaptProperties(providerData: ProviderDataAdaptable) {
    const database = new Database();
    const name = providerData.constructor.name.toUpperCase();
    return get(providerData.createOptionsFor(this.tokenUID)).then((providerResponse) => {
      const subscriptions = providerData.map(providerResponse);
      return database.collection(`users/${this.userUID}/providers`).storeWith(name, {
        subscriptions,
      });
    });
  }

  async adapt(providerData: ProviderDataAdaptable) {
    const subscriptions  = await get(providerData.createOptionsFor(this.tokenUID)).then((providerResponse) => providerData.map(providerResponse));
    const source = new Source();
    source.save(subscriptions, this.userUID);
  }
}

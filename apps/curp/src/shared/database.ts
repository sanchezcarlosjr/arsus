import { WhereFilterOp } from '@firebase/firestore-types';
import { getFirestore } from 'firebase-admin/firestore';

export class Database {
  private firestore = getFirestore();
  private _collection = 'users';

  public get batch() {
    return this.firestore.batch();
  }

  public getFirestore() {
    return this.firestore;
  }

  public doc(id: string) {
    return this.firestore.collection(this._collection).doc(id);
  }

  destroy(path: string) {
    return this.firestore.collection(this._collection).doc(path).delete();
  }

  public storeWith(id: string, body: any, created_at: Date = new Date()): Promise<any> {
    return this.firestore
      .collection(this._collection)
      .doc(id)
      .set({
        ...body,
        uid: id,
        created_at,
      });
  }

  public setDocument(id: string, body: any) {
    return this.firestore
      .collection(this._collection)
      .doc(id)
      .set({
        ...body,
      });
  }

  public storeOrUpdateIf(determinate: boolean, body: any) {
    return determinate ? this.storeWith(body.uid, body) : this.update(body.uid, body);
  }

  public async storeAndUpdateWith(uid: string, body: any) {
    const exists = await this.exits(uid);
    return exists ? this.update(uid, body) : this.storeWith(uid, body);
  }

  public async exits(documentID: string): Promise<boolean> {
    const documentReference = await this.show(documentID);
    return documentReference.exists;
  }

  public where(field: string, opString: WhereFilterOp, value: string) {
    return this.firestore.collection(this._collection).where(field, opString, value);
  }

  public async whereData(field: string, opString: WhereFilterOp, value: any) {
    const query = this.where(field, opString, value);
    const response = await query.get();
    return response.docs.map((document) => document.data());
  }

  public store(body: any) {
    return this.firestore.collection(this._collection).add({
      ...body,
      created_at: new Date(),
    });
  }

  public update(id: string, body: any) {
    return this.firestore
      .collection(this._collection)
      .doc(id)
      .update({
        ...body,
        updated_at: new Date(),
      });
  }

  public show(id: string): Promise<any> {
    return this.firestore.collection(this._collection).doc(id).get();
  }

  public async index() {
    const response = await this.firestore.collection(this._collection).get();
    return response.docs.map((document) => document.data());
  }

  async storeAutogeneratedUID(body: any) {
    const document = await this.store(body);
    await document.update({
      uid: document.id,
    });
    return document;
  }

  public async showData(id: string) {
    return (await this.show(id)).data();
  }

  public async showDocumentByCollection<T>(collection: string, id: string): Promise<T> {
    return this.firestore
      .collection(collection)
      .doc(id)
      .get()
      .then((document) => document.data() as T);
  }

  public async existsByCollection<T>(collection: string, id: string): Promise<boolean> {
    return this.firestore
      .collection(collection)
      .doc(id)
      .get()
      .then((document) => document.exists);
  }

  public collection(collection: string) {
    if (collection) {
      this._collection = collection;
    }
    return this;
  }
}

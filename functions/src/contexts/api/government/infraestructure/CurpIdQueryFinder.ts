import { CurpId } from '../domain/CurpId';
import { CurpResponse } from '../domain/CurpResponse';
import { CurpIdRepository } from '../domain/CurpIdRepository';
import admin from 'firebase-admin';

export class CurpIdQueryFinder extends CurpIdRepository {
  search(id: CurpId): Promise<CurpResponse> {
    return admin
      .firestore()
      .doc(`id/${id.value}`)
      .get()
      .then((document) => document.data() as CurpResponse);
  }
}

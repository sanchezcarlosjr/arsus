import admin from 'firebase-admin';
import { CurpId } from '../domain/CurpId';
import { CurpIdRepository } from '../domain/CurpIdRepository';
import { CurpResponse } from '../domain/CurpResponse';

export class CurpIdQueryFinder extends CurpIdRepository {
  search(id: CurpId): Promise<CurpResponse> {
    return admin
      .firestore()
      .doc(`id/${id.value}`)
      .get()
      .then((document) => {
        const data = document.data();
        if (!data) {
          return null;
        }
        return {
          curp: data.curp,
          fatherName: data.fatherName,
          motherName: data.motherName,
          name: data.name,
          gender: data.gender,
          birthday: data.birthday,
          birthState: data.birthState,
        };
      });
  }
}

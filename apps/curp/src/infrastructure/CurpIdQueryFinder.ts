import { CurpId } from '../domain/CurpId.js';
import { CurpIdRepository } from '../domain/CurpIdRepository.js';
import { CurpResponse } from '../domain/CurpResponse.js';
import { getFirestore } from 'firebase-admin/firestore';

export class CurpIdQueryFinder extends CurpIdRepository {
  search(id: CurpId): Promise<CurpResponse> {
    return getFirestore()
      .doc(`id/${id.value}`)
      .get()
      .then((document: { exists: any; data: () => any }) => {
        if (!document.exists) {
          return null;
        }
        const data = document.data();
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

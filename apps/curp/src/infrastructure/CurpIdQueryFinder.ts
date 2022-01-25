import { CurpId } from '../domain/CurpId.js';
import { CurpIdRepository } from '../domain/CurpIdRepository.js';
import { getFirestore } from 'firebase-admin/firestore';

export class CurpIdQueryFinder extends CurpIdRepository {
  search(id: CurpId) {
    return getFirestore()
      .doc(`id/${id.value}`)
      .get()
      .then((document: { exists: any; data: () => any }) => {
        if (!document.exists) {
          return null;
        }
        const data = document.data();
        if (data.error) {
          return {
            curp: id.value,
            error: data.error,
          };
        }
        return data;
      });
  }
}

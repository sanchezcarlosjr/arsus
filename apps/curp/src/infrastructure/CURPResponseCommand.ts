import { Command } from '../application/CommandBatch.js';
import { CurpResponse } from '../domain/CurpResponse.js';
import { getFirestore } from 'firebase-admin/firestore';

export class CURPResponseCommand implements Command {
  constructor() {}

  execute(curpResponse: CurpResponse) {
    return getFirestore().collection('id').doc(curpResponse.curp).set(curpResponse);
  }
}

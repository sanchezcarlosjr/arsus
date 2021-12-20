import * as admin from 'firebase-admin';
import { Command } from '../application/CommandBatch.js';
import { CurpResponse } from '../domain/CurpResponse.js';

export class CURPResponseCommand implements Command {
  constructor() {}
  execute(curpResponse: CurpResponse) {
    return admin.firestore().collection('id').doc(curpResponse.curp).set(curpResponse);
  }
}

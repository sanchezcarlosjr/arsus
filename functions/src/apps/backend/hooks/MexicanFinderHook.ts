import * as functions from 'firebase-functions';
import { EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { Database } from '../../../database/database';
import { MexicanFinder } from './../../../contexts/api/government/application/MexicanFinder';
import { CurpResponse } from './../../../contexts/api/government/domain/CurpResponse';

const database = new Database();
const mexicanFinder = new MexicanFinder();

export const MexicanFinderHook = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '2GB',
  }).firestore.document('id/{curp}')
  .onCreate(async (documentSnapshot: DocumentSnapshot, context: EventContext) => {
    const mexican = await mexicanFinder.find(documentSnapshot.data() as CurpResponse);
    return database.collection('id').update(documentSnapshot.id, mexican);
  });
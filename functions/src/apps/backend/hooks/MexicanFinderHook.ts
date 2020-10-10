import * as functions from 'firebase-functions';
import { EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { MexicanFinder } from './../../../contexts/api/government/application/MexicanFinder';
import { CurpResponse } from './../../../contexts/api/government/domain/CurpResponse';

export const MexicanFinderHook = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '2GB',
  }).firestore.document('id/{curp}')
  .onCreate((documentSnapshot: DocumentSnapshot, context: EventContext) => {
      return new MexicanFinder().find(documentSnapshot.data() as CurpResponse);
  });
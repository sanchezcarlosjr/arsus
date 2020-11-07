import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Change, EventContext } from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export const InfonavitCollectionUpdaterHook = functions
    .runWith({
        timeoutSeconds: 30,
        memory: '2GB',
    }).firestore.document('infonavit/{nss}')
    .onUpdate(async (change: Change<QueryDocumentSnapshot>, context: EventContext) => {
        return admin.firestore().collection(`infonavit/${context.params.nss}/records`).add(change.before.data());
    });
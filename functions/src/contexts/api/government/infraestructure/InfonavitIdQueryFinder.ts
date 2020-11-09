import { Timestamp } from '@firebase/firestore-types';
import admin from 'firebase-admin';
import * as moment from 'moment';
import { InfonavitResponse } from '../domain/InfonavitResponse';
import { SecuritySocialNumber } from '../domain/SecuritySocialNumber';

export class InfonavitIdQueryFinder {
    async find(id: SecuritySocialNumber): Promise<InfonavitResponse> {
        return admin.firestore().collection('infonavit').doc(id.value).get().then(
            (document) => {
                if (!document.exists) {
                    return null;
                }
                const infonavitResponse = document.data();
                const start = moment().subtract(5, 'week');
                const now = new Date();
                if (!moment((infonavitResponse.created_at as Timestamp)?.toDate()).isBetween(start, now)) {
                    return null;
                }
                return infonavitResponse;
            }
        );
    }
}

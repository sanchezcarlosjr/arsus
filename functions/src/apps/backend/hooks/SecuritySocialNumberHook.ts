import * as functions from 'firebase-functions';
import { EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { get } from 'request-promise';
import { Database } from '../../../database/database';

export interface IMSSResponse {
    datosPersonales: any;
    unidadMedica: any;
    vigencia: any;
}

export class SecuritySocialNumber {
    private record: IMSSResponse = null;
    constructor(private curp: string) {}
    async find() {
        this.record = await get('https://imss.p.rapidapi.com/GetRecord', {
            qs: {
                curp: this.curp
            },
            headers: {
                'x-rapidapi-host': 'imss.p.rapidapi.com',
                'x-rapidapi-key': 'fb542f27admsh62a79f5c3c5c2e9p115517jsn1a7ef511ebd1',
                useQueryString: true
            },
            json: true
      })
    }
    doStrategy() {
        if (this.record.datosPersonales) {
            return {
                isRegisteredInIMSS: true, 
                nss:  this.record.datosPersonales.nss,
                idAssignmentNss: this.record.datosPersonales.idAsignacionNss,
            }
        }
        return  {
            isRegisteredInIMSS: false
        }
    }
    store(): Promise<void> {
        const database = new Database();
        return database.collection('id').update(this.curp, this.doStrategy());
    }
}



export const MexicanFinder = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '2GB',
  }).firestore.document('id/{curp}')
  .onCreate(async (documentSnapshot: DocumentSnapshot, context: EventContext) => {
      const securitySocialNumber = new SecuritySocialNumber(documentSnapshot.id);
      await securitySocialNumber.find();
      return securitySocialNumber.store(); 
  });
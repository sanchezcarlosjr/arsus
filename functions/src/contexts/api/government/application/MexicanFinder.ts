import { Database } from './../../../../database/database';
import { CurpResponse } from './../domain/CurpResponse';
import { RFCRapidapiFinder } from './../infraestructure/RFCRapidapiFinder';
import { SecuritySocialNumberRapidapiFinder } from './../infraestructure/SecuritySocialNumberRapidapiFinder';


export class MexicanFinder {
    private database = new Database();
    async find(curp: CurpResponse) {
        const requests = [new SecuritySocialNumberRapidapiFinder(curp.curp), new RFCRapidapiFinder(curp.name, curp.fatherName, curp.motherName, curp.birthday)]
        return Promise.all(requests.map(async (request) => {
            try {
              const response  = await request.find();
              return this.database.collection('id').update(curp.curp, response);
            } catch(e) {
                 console.warn(e);
            }
        }));
    }
}
import { Database } from './../../../../database/database';
import { CurpResponse } from './../domain/CurpResponse';
import { RFCRapidapiFinder } from './../infraestructure/RFCRapidapiFinder';
import { SecuritySocialNumberRapidapiFinder } from './../infraestructure/SecuritySocialNumberRapidapiFinder';


export class MexicanFinder {
    private database = new Database();
    async find(curp: CurpResponse) {
        const securitySocialNumber = new SecuritySocialNumberRapidapiFinder(curp.curp);
        const rfc = new RFCRapidapiFinder(curp.name, curp.fatherName, curp.motherName, curp.birthday);
        const object = {
            ...await securitySocialNumber.find(),
            ...await rfc.find()
        };
        return this.database.collection('id').update(curp.curp, object);
    }
}
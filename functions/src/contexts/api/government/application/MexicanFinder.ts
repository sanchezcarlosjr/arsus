import { CurpResponse } from './../domain/CurpResponse';
import { RFCRapidapiFinder } from '../infrastructure/RFCRapidapiFinder';
import { SecuritySocialNumberRapidapiFinder } from '../infrastructure/SecuritySocialNumberRapidapiFinder';

let t = 0;

export class MexicanFinder {
  async find(curp: CurpResponse) {
    t++;
    console.log('\x1b[36m%s\x1b[0m', `${t}. ${curp.curp}`);
    const securitySocialNumberFinder = new SecuritySocialNumberRapidapiFinder(curp.curp);
    const rfcFinder = new RFCRapidapiFinder(curp.name, curp.fatherName, curp.motherName, curp.birthday);
    return {
      ...(await securitySocialNumberFinder.find()),
      ...(await rfcFinder.find()),
    };
  }
}

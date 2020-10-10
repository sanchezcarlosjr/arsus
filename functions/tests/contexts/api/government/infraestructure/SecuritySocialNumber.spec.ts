import { expect } from 'chai';
import * as mocha from 'mocha';
import { AdminWrapper } from '../../../../AdminWrapper';
import { RFCRapidapiFinder } from './../../../../../src/contexts/api/government/infraestructure/RFCRapidapiFinder';
import { SecuritySocialNumberRapidapiFinder } from './../../../../../src/contexts/api/government/infraestructure/SecuritySocialNumberRapidapiFinder';

mocha.describe('Mexican Finder', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it('should request IMSS API', async () => {
      const securitySocialNumber = new SecuritySocialNumberRapidapiFinder("");
      const data = await securitySocialNumber.find();
      expect(data.isRegisteredInIMSS).to.equal(true);
  });
  it('should request RFC API', async () => {
      const rfc = new RFCRapidapiFinder(
            "",
            "",
            "",
            ""
          );
      const data = await rfc.find();
      expect(data.rfc).to.equal("");
      expect(data.isLRFC).to.equal(true);
  });
});

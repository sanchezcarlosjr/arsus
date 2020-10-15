import { expect } from 'chai';
import * as mocha from 'mocha';
import { AdminWrapper } from '../../../../AdminWrapper';
import { RFCRapidapiFinder } from './../../../../../src/contexts/api/government/infraestructure/RFCRapidapiFinder';

mocha.describe('Mexican Finder', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
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

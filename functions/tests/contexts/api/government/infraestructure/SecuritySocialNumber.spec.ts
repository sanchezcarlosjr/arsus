import { expect } from 'chai';
import * as mocha from 'mocha';
import { AdminWrapper } from '../../../../AdminWrapper';
import { SecuritySocialNumber } from './../../../../../src/apps/backend/hooks/SecuritySocialNumberHook';

mocha.describe('Security Social Number', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it.only('should request IMSS API', async () => {
      const securitySocialNumber = new SecuritySocialNumber("AAAA560801HDFLLN00");
      await securitySocialNumber.find();
      const data = securitySocialNumber.doStrategy();
      expect(data.isRegisteredInIMSS).to.equal(true);
  });
});

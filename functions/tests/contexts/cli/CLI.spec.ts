import * as admin from 'firebase-admin';
import * as mocha from 'mocha';
import { AdminWrapper } from '../../AdminWrapper';

mocha.describe('CLI', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it('Admin CLI', async () => {
    admin.auth().setCustomUserClaims('', {admin: true}).then(() => {});
  });
});

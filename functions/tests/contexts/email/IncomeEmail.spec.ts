import * as mocha from 'mocha';
import { AdminWrapper } from '../../AdminWrapper';
import { InboundEmail } from '../../../src/contexts/email/application/InboundEmail';

mocha.describe('IncomeEmail', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it('should save email when from be no-reply', async () => {
    const incomeEmail = new InboundEmail(undefined, undefined, undefined, undefined, undefined);
    await incomeEmail.doStrategy();
  });
});

import * as mocha from 'mocha';
import { AdminWrapper } from '../../AdminWrapper';
import { expect } from 'chai';
import { UABCScrapper } from '../../../src/contexts/uabc_scheduler/infraestructure/UABCScrapper';

mocha.describe('UABCScheduler', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it.only('should scrape UABC Site', async () => {
    const uabc = new UABCScrapper('a361075@uabc.edu.mx', '7Kx86QRRxQeHM@g5');
    const subjects = await uabc.scrape();
    console.log(subjects);
    expect(subjects.length > 0).to.equal(true);
  });
});

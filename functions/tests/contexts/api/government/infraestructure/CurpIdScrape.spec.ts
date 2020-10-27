import { assert, expect } from 'chai';
import * as mocha from 'mocha';
import { CurpIdFinder } from '../../../../../src/contexts/api/government/application/CurpIdFinder';
import { ensureIsValidApiKey } from '../../../../../src/contexts/api/government/domain/ApiKey';
import { CurpId } from '../../../../../src/contexts/api/government/domain/CurpId';
import { CurpResponse } from '../../../../../src/contexts/api/government/domain/CurpResponse';
import { CurpIdQueryFinder } from '../../../../../src/contexts/api/government/infraestructure/CurpIdQueryFinder';
import { CurpIdScraper } from '../../../../../src/contexts/api/government/infraestructure/CurpIdScraper';
import { Database } from '../../../../../src/database/database';
import { AdminWrapper } from '../../../../AdminWrapper';
import { QuotaCounter } from './../../../../../src/apps/backend/controllers/Curp';

const examples: CurpResponse[] = [
  {
    curp: '',
    fatherName: '',
    motherName: '',
    name: '',
    gender: '',
    birthday: '',
    birthState: '',
  },
];

mocha.describe('CURP Api', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it('should update daily quota', async () => {
    const quota = new QuotaCounter('');
    await quota.execute();
  });
  it('should show error when it invalid API Key', async () => {
    try {
      await ensureIsValidApiKey('');
    } catch (e) {
      expect(e.message).to.equal(`Api key '' not found. You need to sign up on https://sanchezcarlosjr.com`);
    }
  });
  it('should show error when it API Key not found', async () => {
    try {
      await ensureIsValidApiKey('444');
    } catch (e) {
      expect(e.message).to.equal(`Api key '444' not found. You need to sign up on https://sanchezcarlosjr.com`);
    }
  });

  it('should not show error with valid API Key', async () => {
    try {
      await ensureIsValidApiKey('444');
    } catch (e) {
      if (e.message && e.message === `Api key '444' not found. You need to sign up on https://sanchezcarlosjr.com`)
        throw Error();
    }
  });

  it('should validate CURP', () => {
    assert.doesNotThrow(() => new CurpId('C'), `'CASE00011NMA8' is a invalid curp`);
    assert.throw(() => new CurpId('CASE0001A'), `'CASE000116NMA' is a invalid curp`);
  });
  it('should search a curp id', async () => {
    const curpIdScrape = new CurpIdScraper();
    const curpId = new CurpId(examples[0].curp);
    const curpResponse: CurpResponse = await curpIdScrape.search(curpId);
    assert.deepEqual(curpResponse, examples[0]);
  });
  it('should caching a curp id', async () => {
    const database = new Database();
    database.collection('id');
    for (const example of examples) {
      const curpResponse = await new CurpIdFinder(new CurpIdScraper(), new CurpIdQueryFinder()).find(
        new CurpId(example.curp)
      );
      assert.deepEqual(curpResponse, example);
      await database.destroy(example.curp);
    }
  });
});

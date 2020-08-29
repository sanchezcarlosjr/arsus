import * as mocha from 'mocha';
import { AdminWrapper } from '../../../../AdminWrapper';
import { CurpId } from '../../../../../src/contexts/api/government/domain/CurpId';
import { assert, expect } from 'chai';
import { CurpResponse } from '../../../../../src/contexts/api/government/domain/CurpResponse';
import { CurpIdScraper } from '../../../../../src/contexts/api/government/infraestructure/CurpIdScraper';
import { ensureIsValidApiKey } from '../../../../../src/contexts/api/government/domain/ApiKey';
import { CurpIdFinder } from '../../../../../src/contexts/api/government/application/CurpIdFinder';
import { CurpIdQueryFinder } from '../../../../../src/contexts/api/government/infraestructure/CurpIdQueryFinder';
import { Database } from '../../../../../src/database/database';

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
  it('should validate API Key', async () => {
    try {
      await ensureIsValidApiKey('');
    } catch (e) {
      expect(e.message).to.equal(`Api key '' not found. You need to sign up on https://sanchezcarlosjr.com`);
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

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as mocha from 'mocha';
import { SecuritySocialNumber } from '../../../../../src/contexts/api/government/domain/SecuritySocialNumber';
import {
  CaptchaError,
  InfonavitScrapper,
  PersonWithoutCreditError,
} from '../../../../../src/contexts/api/government/infrastructure/InfonavitScrapper';
import { AdminWrapper } from '../../../../AdminWrapper';
import { Birthday } from './../../../../../src/contexts/api/government/domain/Birthday';
import { InfonavitIdQueryFinder } from '../../../../../src/contexts/api/government/infrastructure/InfonavitIdQueryFinder';

chai.use(chaiAsPromised);

const assert = chai.assert;
const expect = chai.expect;

mocha.describe('Infonavit', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it('should validate security social number', async () => {
    assert.throw(() => new SecuritySocialNumber('638210785'), `'638210785' is a invalid security social number`);
    assert.throw(() => new SecuritySocialNumber('63806210786'), `'63806210786' is a invalid security social number`);
    assert.doesNotThrow(
      () => new SecuritySocialNumber('63806210785'),
      `'63806210785' is a invalid security social number`
    );
  });
  it('should show error about captcha', async () => {
    const infonavit = new InfonavitScrapper();
    return expect(
      infonavit.find(new SecuritySocialNumber('96927225985'), new Birthday('1972-05-21T00:00:00.000Z'))
    ).to.be.rejectedWith(CaptchaError, 'invalid security social number or birthday');
  });
  it('should show error about modal from web', async () => {
    const infonavit = new InfonavitScrapper();
    return expect(
      infonavit.find(new SecuritySocialNumber('96927225985'), new Birthday('1972-05-21T00:00:00.000Z'))
    ).to.be.rejectedWith(PersonWithoutCreditError, 'sin relacion laboral vigente en el tercer  bimestre del 2020');
  });
  it('should not find security social number in database when it not exists', () => {
    const infonavit = new InfonavitIdQueryFinder();
    return expect(infonavit.find(new SecuritySocialNumber('96927225985'))).to.eventually.equal(null);
  });
  it('should find security social number in database when it exists', () => {
    const infonavit = new InfonavitIdQueryFinder();
    return expect(infonavit.find(new SecuritySocialNumber('07109209614'))).to.eventually.eql({
      creditFromInfonavit: 316938.24,
      housingSubAccountBalance: 45218.87,
      operatingExpenses: 9508.14,
      total: 352648.97,
      monthlySalaryDiscount: 2668.86,
      creditForEcotechnologies: 15846.9,
    });
  });
  it('should return null if expired infonavit', () => {
    const infonavit = new InfonavitIdQueryFinder();
    return expect(infonavit.find(new SecuritySocialNumber('07109209614'))).to.eventually.equal(null);
  });
  it('should foramt birthday', () => {
    const date = '1995-03-24T00:00:00.000Z';
    const birthday = new Birthday(date);
    expect(birthday.value).to.equal('24/03/1995');
  });
  it('should scrappe about infonavit site when it is second client credit', () => {
    const infonavit = new InfonavitScrapper();
    return expect(
      infonavit.find(new SecuritySocialNumber('21048558601'), new Birthday('1985-11-24T00:00:00.000Z'))
    ).to.eventually.eql({
      creditFromInfonavit: 1030049.28,
      housingSubAccountBalance: 59219.53,
      operatingExpenses: 51502.46,
      total: 1037766.35,
      product: 'CII',
      monthlySalaryDiscount: 9532.15,
      creditForEcotechnologies: 52823.0,
    });
  });
  it('should srappe infonavit site', () => {
    const infonavit = new InfonavitScrapper();
    return expect(
      infonavit.find(new SecuritySocialNumber('63806210785'), new Birthday('1962-02-19T00:00:00.000Z'))
    ).to.eventually.eql({
      creditFromInfonavit: 316938.24,
      housingSubAccountBalance: 45218.87,
      operatingExpenses: 9508.14,
      total: 352648.97,
      monthlySalaryDiscount: 2668.86,
      creditForEcotechnologies: 15846.9,
    });
  });
  it('temp', async () => {
    const infonavit = new InfonavitScrapper();
    await infonavit.find(new SecuritySocialNumber('96927225985'), new Birthday('1972-05-21T00:00:00.000Z'));
  });
  it('test', async () => {
    const doSomethingAsync = async () => {
      throw new Error('message');
    };
    expect(doSomethingAsync()).to.be.rejectedWith(Error, 'message');
  });
});

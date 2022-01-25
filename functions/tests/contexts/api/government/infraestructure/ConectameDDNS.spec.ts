import { expect } from 'chai';
import * as mocha from 'mocha';
import { ConectameDDNS } from '../../../../../src/contexts/api/government/infrastructure/ConectameDDNS';

mocha.describe('Conectame Account Generator', () => {
  it.only('should create an account on Conectame DDNS site', async () => {
    const { username, password } = new ConectameDDNS().createAccount();
    expect(username).to.be.an('string');
    expect(password).to.be.an('string');
  });
});

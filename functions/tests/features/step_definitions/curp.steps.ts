import { Given, Then } from 'cucumber';
import assert = require('assert');
import { curp } from '../../../src/apps/backend/controllers/Curp';
import { AdminWrapper } from '../../AdminWrapper';

let _response: any;

const res: any = {
  send: (resp: any) => (_response = resp),
  status: (status: number) => {
    return {
      send: (resp: any) => {},
    };
  },
  setHeader: (name: string, value: string) => {
    console.log(name);
    console.log(value);
  },
};

Given('I send a GET request to {string}', (route: string) => {
  const urlParams = new URLSearchParams(route);
  const admin = new AdminWrapper();
  admin.setRealEnvironment(true);
  const req: any = { query: { apiKey: urlParams.get('apiKey'), curp: urlParams.get('curp') } };
  curp(req, res);
});

Then('the response body should be', (response: any) => {
  assert.deepStrictEqual(_response, JSON.parse(response));
});

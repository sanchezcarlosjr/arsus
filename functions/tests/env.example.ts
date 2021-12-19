import { CurpResponse } from '../src/contexts/api/government/domain/CurpResponse';

export const mockConfig = {
  bot: {
    questions_game: '',
  },
  sendgrid: {
    key: '',
  },
  algolia: {
    appid: '',
    index: '',
    apikey: '',
  },
  stripe: {
    publishablelivekey: '',
    planenterprisebasic: '',
    publishabletestkey: '',
    apikey: '',
  },
  twitter: {
    consumerkey: '',
    consumersecret: '',
  },
  facturapi: {
    userkey: '',
  },
  newsapi: {
    key: '',
  },
  podcast: {
    key: '',
  },
  google: {
    key: '',
    userid: '',
    bucket: '',
  },
  rapidapi: {
    key: '',
  },
  algolia_partners: {
    apikey: '',
    appid: '',
    index: 'prod_partners',
  },
  twillio: {
    auth_token: '',
    account_sid: '',
  },
  captcha2: {
    key: '',
  },
};

export const mockEnv = {
  obverse: '',
  back: '',
  cic: '',
  curp: '',
  url: '',
  assets: '',
  id: '',
  backText: '',
};

export const curpExamples: CurpResponse[] = [
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

import * as test from 'firebase-functions-test';
import * as productionAdmin from 'firebase-admin';

export class AdminWrapper {
  private projectConfig = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  };
  private mockConfig = {
    twillio: {
      account_sid: '',
      auth_token: '',
    },
    stripe: {
      planenterprisebasic: '',
      apikey: '',
      publishablelivekey: '',
      publishabletestkey: '',
    },
    google: {
      userid: '',
      bucket: '',
      key: '',
    },
    podcast: {
      key: '',
    },
    facturapi: {
      userkey: '',
    },
    newsapi: {
      key: '',
    },
    algolia: {
      appid: '',
      apikey: '',
      index: '',
    },
    algolia_partners: {
      index: '',
      apikey: '',
      appid: '',
    },
    sendgrid: {
      key: '',
    },
  };

  constructor() {
    const functions = test(this.projectConfig, './tests/service-account-credentials.json');
    functions.mockConfig(this.mockConfig);
  }

  setRealEnvironment(productionEnvironment: boolean) {
    if (productionEnvironment) {
      productionAdmin.initializeApp(this.projectConfig);
    }
  }
}

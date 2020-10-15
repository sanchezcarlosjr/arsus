import * as productionAdmin from 'firebase-admin';
import * as test from 'firebase-functions-test';
import { mockConfig } from './env';

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

  constructor() {
    const functions = test(this.projectConfig, './tests/service-account-credentials.json');
    functions.mockConfig(mockConfig);
  }

  setRealEnvironment(productionEnvironment: boolean) {
    if (productionEnvironment) {
      productionAdmin.initializeApp(this.projectConfig);
    }
  }
}

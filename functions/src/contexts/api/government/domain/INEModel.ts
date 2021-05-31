import { INEResponse } from './INEResponse';
import { PageCreator } from '../../../shared/PageCreator';
import { config } from 'firebase-functions';

const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

export abstract class INEModel {
  protected readonly URL: string = 'https://listanominal.ine.mx/scpln/';
  abstract match(obverse: string, back: string): INEModel;

  abstract scrape(userId: string): Promise<INEResponse>;

  abstract toString(): string;

  createPage() {
    return PageCreator.getInstance(
      this.URL,
      RecaptchaPlugin({
        provider: {
          id: '2captcha',
          token: config().captcha2.key,
        },
        visualFeedback: false,
      })
    );
  }
}

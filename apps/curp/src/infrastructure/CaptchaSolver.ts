import * as Captcha from '2captcha';
import { config } from 'firebase-functions';

export class CaptchaSolver {
  solver = new Captcha.Solver(config().captcha2.key);

  /**
   * Returns  the answer token (captcha solution)
   * https://2captcha.com/2captcha-api#solving_captchas
   */
  async solve(googlekey: string, pageurl: string): Promise<string> {
    return (await this.solver.recaptcha(googlekey, pageurl)).data;
  }
}

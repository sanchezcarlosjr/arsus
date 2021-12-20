import * as Captcha from '2captcha';
import { config } from 'firebase-functions';

export class CaptchaSolver {
  solver = new Captcha.Solver(config().captcha2.key);

  async solve(googlekey: string, pageurl: string) {
    return (await this.solver.recaptcha(googlekey, pageurl)).data;
  }
}

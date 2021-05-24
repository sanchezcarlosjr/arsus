import { Page } from 'puppeteer-extra/dist/puppeteer';
import { config } from 'firebase-functions';
import puppeteer from 'puppeteer-extra';

const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

export class PageCreator {
  private static instance: PageCreator = null;

  private constructor(private page: Page) {}

  static async getInstance(url: string) {
    if (PageCreator.instance === null) {
      const page = await PageCreator.launch(url);
      PageCreator.instance = new PageCreator(page);
    }
    return PageCreator.instance;
  }

  private static async launch(
    url: string,
    captcha: { provider: { id: string; token: any }; visualFeedback: boolean } = {
      provider: {
        id: '2captcha',
        token: config().captcha2.key,
      },
      visualFeedback: false,
    }
  ) {
    puppeteer.use(RecaptchaPlugin(captcha));
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
        "--proxy-server='direct://'",
        '--proxy-bypass-list=*',
        '--deterministic-fetch',
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    );
    await page.setViewport({ width: 1680, height: 1050 });
    await page.goto(url);
    return page;
  }

  getPage() {
    return this.page;
  }

  async type(xPath: string, value: string) {
    const input = await this.getPage().$x(xPath);
    await this.getPage().evaluate((elementHandler, user) => (elementHandler.value = user), input[0], value);
  }

  async click(xPath: string) {
    const element = await this.page.$x(xPath);
    await element[0].click();
    await this.page.waitForNavigation();
  }

  async count(xPath: string) {
    return (await this.page.$x(xPath)).length;
  }

  async read(xPath: string) {
    const element = await this.page.waitForXPath(xPath);
    return await element.evaluate((el) => el.textContent);
  }
}

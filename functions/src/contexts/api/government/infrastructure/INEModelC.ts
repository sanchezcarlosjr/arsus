import { INEModel } from '../domain/INEModel';
import { INEResponse } from '../domain/INEResponse';

export class INEModelC extends INEModel {
  constructor(private electorKey: string, private emission: string, private ocr: string) {
    super();
  }

  toString(): string {
    return `INEModelD ${this.ocr} ${this.electorKey} ${this.emission}`;
  }

  async scrape(userId: string): Promise<INEResponse> {
    const page = await this.createPage();
    await page.type('//*[@id="claveElector"]', this.electorKey);
    await page.type('//*[@id="ocr"]', this.ocr);
    await page.type('//*[@id="numeroEmision"]', this.emission);
    await page.solveCaptchas();
    await page.click('/html/body/div[1]/section[4]/div/div[3]/div[2]/form/div[3]/div/div/button');
    const credentialTable = await page.count('/html/body/div[1]/section[3]/div/div[2]/div[1]/table/tbody/tr[1]/td[2]');
    const url = await page.screenshot(`users/${userId}/nominal-list-ine-${new Date().toISOString()}.png`);
    return {
      url,
      isValidINE: credentialTable > 0,
    };
  }

  match(obverse: string, back: string): INEModel {
    this.ocr = back.match(/Emisión(\\n| )(\d)/)[1];
    this.electorKey = obverse.match(/[A-Z]{6}[0-9]{8}[A-Z][0-9]{3}/)[1];
    this.emission = back.match(/[^A-Z](\d{12})/)[1];
    return this;
  }
}

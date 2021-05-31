import { INEModel } from '../domain/INEModel';
import { INEResponse } from '../domain/INEResponse';

export class INEModelEFGH extends INEModel {
  constructor(private cic: string, private id: string) {
    super();
  }

  toString(): string {
    return `INEModelEFGH ${this.cic} ${this.id}`;
  }

  async scrape(userId: string): Promise<INEResponse> {
    const page = await this.createPage();
    await page.type('//*[@id="cic"]', this.cic);
    await page.type('//*[@id="idCiudadano"]', this.id);
    await page.solveCaptchas();
    await page.click('/html/body/div[1]/section[4]/div/div[1]/div[2]/form/div[2]/div[2]/button');
    const credentialTable = await page.count('/html/body/div[1]/section[3]/div/div[2]/div[1]/table/tbody/tr[1]/td[2]');
    const url = await page.screenshot(`users/${userId}/nominal-list-ine-${new Date().toISOString()}.png`);
    return {
      url,
      isValidINE: credentialTable > 0,
    };
  }

  match(obverse: string, back: string): INEModel {
    this.cic = back.match(/IDMEX(\d{9})/)[1];
    this.id = back.match(/<<\d{4}(\d{9})\n/)[1];
    return this;
  }
}

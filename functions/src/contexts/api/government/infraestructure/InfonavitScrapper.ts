import { Page } from 'puppeteer-extra/dist/puppeteer';
import { CommandBatch } from '../application/CommandBatch';
import { Birthday } from './../domain/Birthday';
import { InfonavitResponse } from './../domain/InfonavitResponse';
import { SecuritySocialNumber } from './../domain/SecuritySocialNumber';
import { InfonavitResponseCommand, MexicanGeneratorCommand } from './InfonavitResponseCommand';
import { PageCreator } from '../../../shared/PageCreator';

enum InfonavitPage {
  URL = 'https://precalificaciones.infonavit.org.mx/Precalificacion/precalif.xhtml?tipoProducto=CI',
  URL_II = 'https://precalificaciones.infonavit.org.mx/Precalificacion/precalif.xhtml?tipoProducto=CII',
  INPUT_NSS = '//*[@id="precalif:nssTitular"]',
  INPUT_BIRTHDAY = '//*[@id="precalif:fechaTitular"]',
  DIV_ERROR_CAPTCHA = '/html/body/div[3]/div[2]/form/div[1]/div',
  SUBMIT = '/html/body/div[3]/div[2]/form/div[2]/div/div[2]/table[2]/tbody/tr[2]/td/button',
  MODAL_SPAN_NAME = '/html/body/div[3]/div[2]/form/div[5]/div[2]/table/tbody/tr[2]/td[2]/span',
  MODAL_SPAN_ERROR = '/html/body/div[3]/div[2]/form/div[5]/div[2]/table/tbody/tr[3]/td/span',
  UNAUTHORIZATION = '/html/body/div[3]/div[2]/form/div[2]/div/div/table[3]/tbody/tr[1]/td[2]/table/tbody/tr/td[3]/div/div[2]/span',
}

export class PersonWithoutCreditError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CaptchaError extends Error {
  constructor() {
    super('invalid security social number or birthday');
  }
}

interface InfonavitProduct {
  scrape: () => Promise<InfonavitResponse>;
}

abstract class Credit implements InfonavitProduct {
  protected readonly URL: string;
  protected readonly PRODUCT: string;
  private nextInfonavitProduct: InfonavitProduct = undefined;

  constructor(private securitySocialNumber: SecuritySocialNumber, private birthday: Birthday, private page: Page) {}

  async scrape() {
    await this.page.goto(this.URL);
    return this.search();
  }

  setInfonavitProduct(infonavitProduct: InfonavitProduct) {
    this.nextInfonavitProduct = infonavitProduct;
  }

  async click(xPath: string) {
    const element = await this.page.$x(xPath);
    await element[0].click();
    await this.page.waitForNavigation();
  }

  async getTextFrom(xPath: string, property = 'innerText'): Promise<string> {
    const spanElement = await this.page.$x(xPath);
    if (!spanElement[0]) {
      return '';
    }
    return (await (await spanElement[0].getProperty(property)).jsonValue()) as string;
  }

  private async search() {
    const nss = await this.page.$x(InfonavitPage.INPUT_NSS);
    await this.page.evaluate(
      (elementHandler, securitySocialNumber) => (elementHandler.value = securitySocialNumber),
      nss[0],
      this.securitySocialNumber.value
    );
    const day = await this.page.$x(InfonavitPage.INPUT_BIRTHDAY);
    await this.page.evaluate(
      (elementHandler, birthday) => (elementHandler.value = birthday),
      day[0],
      this.birthday.value
    );
    await (this.page as any).solveRecaptchas();
    await this.click(InfonavitPage.SUBMIT);
    const personWithoutCreditError = await this.getTextFrom(InfonavitPage.MODAL_SPAN_ERROR);
    if (personWithoutCreditError) {
      if (/no corresponde a la registrada/.test(personWithoutCreditError)) {
        throw new Error(personWithoutCreditError);
      }
      if (this.nextInfonavitProduct !== undefined && /YA TUVO CREDITO/.test(personWithoutCreditError)) {
        return this.nextInfonavitProduct.scrape();
      }
      let mexicanName = await this.getTextFrom(InfonavitPage.MODAL_SPAN_NAME);
      CommandBatch.getInstance().addCommand(
        new MexicanGeneratorCommand(mexicanName, this.birthday, this.securitySocialNumber)
      );
      return {
        mexicanName,
        error: personWithoutCreditError.toLowerCase().trim(),
      };
    }
    if (this.PRODUCT == 'CI') {
      (await this.page.$x(InfonavitPage.UNAUTHORIZATION))[0].click();
      await this.click('/html/body/div[3]/div[2]/form/div[2]/div/div/table[5]/tbody/tr/td/button');
    }
    let mexicanName = await this.getTextFrom(
      '/html/body/div[3]/div[2]/form[1]/div[2]/div/div/table[1]/tbody/tr/td[4]/strong'
    );
    CommandBatch.getInstance().addCommand(
      new MexicanGeneratorCommand(mexicanName, this.birthday, this.securitySocialNumber)
    );
    return this.mapResponse(mexicanName);
  }

  private async mapResponse(mexicanName: string) {
    const xPaths = [
      '/html/body/div[3]/div[2]/form[1]/div[2]/div/div/table[2]/tbody/tr[4]/td[3]',
      '/html/body/div[3]/div[2]/form[1]/div[2]/div/div/table[2]/tbody/tr[5]/td[3]',
      '/html/body/div[3]/div[2]/form[1]/div[2]/div/div/table[2]/tbody/tr[6]/td[3]',
      '//*[@id="result:descuentoMensualAux"]',
      '//*[@id="result:descuentoEcoAux"]',
    ];
    const promises = await Promise.all(xPaths.map((url) => this.getTextFrom(url)));
    promises.push(await this.getTextFrom('//*[@id="result:montoCreditoAux"]', 'value'));
    const response = promises.map((value) => Number(value.replace(/,/g, '')));
    return {
      creditFromInfonavit: response[5],
      housingSubAccountBalance: response[0],
      operatingExpenses: response[1],
      mexicanName,
      total: response[2],
      monthlySalaryDiscount: response[3],
      creditForEcotechnologies: response[4],
      product: this.PRODUCT,
    };
  }
}

class CreditURL extends Credit {
  constructor(
    securitySocialNumber: SecuritySocialNumber,
    birthday: Birthday,
    page: Page,
    protected URL: string,
    protected PRODUCT: string
  ) {
    super(securitySocialNumber, birthday, page);
  }
}

export class InfonavitScrapper {
  async find(securitySocialNumber: SecuritySocialNumber, birthday: Birthday): Promise<InfonavitResponse> {
    const pageCreator = await PageCreator.getInstance(InfonavitPage.URL);
    const credit = this.getCredits(securitySocialNumber, birthday, pageCreator.getPage());
    const response = await credit.scrape();
    CommandBatch.getInstance().addCommand(new InfonavitResponseCommand(securitySocialNumber));
    return response;
  }

  private getCredits(securitySocialNumber: SecuritySocialNumber, birthday: Birthday, page: Page) {
    const credit1 = new CreditURL(
      securitySocialNumber,
      birthday,
      page,
      'https://precalificaciones.infonavit.org.mx/Precalificacion/precalif.xhtml?tipoProducto=CI',
      'CI'
    );
    const credit2 = new CreditURL(
      securitySocialNumber,
      birthday,
      page,
      'https://precalificaciones.infonavit.org.mx/Precalificacion/precalif.xhtml?tipoProducto=CII',
      'CII'
    );
    credit1.setInfonavitProduct(credit2);
    return credit1;
  }
}

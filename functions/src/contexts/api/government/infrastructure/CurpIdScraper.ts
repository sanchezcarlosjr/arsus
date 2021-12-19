import { CommandBatch } from '../application/CommandBatch';
import { CurpId } from '../domain/CurpId';
import { CurpIdRepository } from '../domain/CurpIdRepository';
import { CurpResponse } from '../domain/CurpResponse';
import { CURPResponseCommand } from './CURPResponseCommand';
import { PageScrapper } from '../../../shared/PageScrapper';
import { Database } from '../../../../database/database';
import { WaitForSelectorOptions } from 'puppeteer';
import moment = require('moment');

export class CurpNotFound extends Error {
  constructor(value: string) {
    super(`CURP '${value}' not found`);
  }
}

enum XPathCurpTableResponse {
  NAME = '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[2]/td[2]',
  BIRTH_STATE = '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[8]/td[2]',
  FATHER_NAME = '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[3]/td[2]',
  MOTHER_NAME = '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[4]/td[2]',
  GENDER = '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[5]/td[2]',
  BIRTHDAY = '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[6]/td[2]',
}

const genderISOConverter = new Map([
  ['HOMBRE', '1'],
  ['MUJER', '2'],
]);

const options: WaitForSelectorOptions = {
  timeout: 3200,
};

export class CurpIdScraper extends CurpIdRepository {
  private database = new Database();

  constructor() {
    super();
  }

  async search(id: CurpId): Promise<CurpResponse> {
    CommandBatch.getInstance().addCommand(new CURPResponseCommand());
    const page = await PageScrapper.instanceWithRecaptchaPlugin('https://www.gob.mx/curp/');
    await page.typeWithSelector('#curpinput', id.value);
    await page.solveCaptchas();
    await page.clickWithSelector('#searchButton');
    let name = '';
    try {
      name = await page.read(XPathCurpTableResponse.NAME, options);
    } catch (e) {
      throw new CurpNotFound(id.value);
    }
    const birthState = await page.read(XPathCurpTableResponse.BIRTH_STATE, options);
    return {
      curp: id.value,
      fatherName: await page.read(XPathCurpTableResponse.FATHER_NAME, options),
      motherName: await page.read(XPathCurpTableResponse.MOTHER_NAME, options),
      name,
      gender: genderISOConverter.get(await page.read(XPathCurpTableResponse.GENDER, options)),
      birthday: moment(await page.read(XPathCurpTableResponse.BIRTHDAY, options), 'DD/MM/YYYY').toISOString(),
      birthState: (await this.database.collection('states').showData(birthState)).iso,
    };
  }
}

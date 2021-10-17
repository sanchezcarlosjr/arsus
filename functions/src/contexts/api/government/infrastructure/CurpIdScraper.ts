import { CommandBatch } from '../application/CommandBatch';
import { CurpId } from '../domain/CurpId';
import { CurpIdRepository } from '../domain/CurpIdRepository';
import { CurpResponse } from '../domain/CurpResponse';
import { CURPResponseCommand } from './CURPResponseCommand';
import { PageScrapper } from '../../../shared/PageScrapper';
import moment = require('moment');
import { Database } from '../../../../database/database';

export class CurpNotFound extends Error {
  constructor(value: string) {
    super(`CURP '${value}' not found`);
  }
}

const genderISOConverter = new Map([
  ['HOMBRE', '1'],
  ['MUJER', '2'],
]);

export class CurpIdScraper extends CurpIdRepository {
  private database = new Database();
  constructor() {
    super();
  }

  async search(id: CurpId): Promise<CurpResponse> {
    CommandBatch.getInstance().addCommand(new CURPResponseCommand());
    const page = await PageScrapper.instanceWithRecaptchaPlugin('https://www.gob.mx/curp/');
    await page.getPage().type('#curpinput', id.value);
    await page.solveCaptchas();
    await page.getPage().click('#searchButton');
    const name = await page.read(
      '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[2]/td[2]'
    );
    if (!name) {
      throw new CurpNotFound(id.value);
    }
    const birthState = await page.read(
      '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[8]/td[2]'
    );
    return {
      curp: id.value,
      fatherName: await page.read(
        '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[3]/td[2]'
      ),
      motherName: await page.read(
        '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[4]/td[2]'
      ),
      name,
      gender: genderISOConverter.get(
        await page.read(
          '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[5]/td[2]'
        )
      ),
      birthday: moment(
        await page.read(
          '/html/body/div[2]/main/div/div/div[2]/section/div/div/div[2]/form/div[2]/div[1]/div/div[2]/table/tr[6]/td[2]'
        ),
        'DD/MM/YYYY'
      ).toISOString(),
      birthState: (await this.database.collection('states').showData(birthState)).iso,
    };
  }
}

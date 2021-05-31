import { get } from 'request-promise';
import { Database } from '../../../../database/database';
import { getGroups } from '../../../shared/regex';
import { CommandBatch } from '../application/CommandBatch';
import { CurpId } from '../domain/CurpId';
import { CurpIdRepository } from '../domain/CurpIdRepository';
import { CurpResponse } from '../domain/CurpResponse';
import { CURPResponseCommand } from './CURPResponseCommand';
import moment = require('moment');

export class CurpNotFound extends Error {
  constructor(value: string) {
    super(`CURP '${value}' not found`);
  }
}

const genderISOConverter = new Map([
  ['H', '1'],
  ['M', '2'],
]);

export class CurpIdScraper extends CurpIdRepository {
  private htmlScrapePattern = /"([A-Z Ñ\-0-9.\/]*)";/gi;
  private database = new Database();
  constructor() {
    super();
  }

  async search(id: CurpId): Promise<CurpResponse> {
    CommandBatch.getInstance().addCommand(new CURPResponseCommand());
    const htmlResponse: string = await get(
      `http://sipso.sedesol.gob.mx/consultarCurp/consultaCurpR.jsp?cveCurp=${id.value}`
    );
    const curpWithoutShape = getGroups(htmlResponse, this.htmlScrapePattern);
    if (!curpWithoutShape[4]) {
      throw new CurpNotFound(id.value);
    }
    return {
      curp: id.value,
      fatherName: curpWithoutShape[1],
      motherName: curpWithoutShape[2],
      name: curpWithoutShape[0],
      gender: genderISOConverter.get(curpWithoutShape[4]),
      birthday: moment(curpWithoutShape[3], 'DD/MM/YYYY').toISOString(),
      birthState: (await this.database.collection('states').showData(curpWithoutShape[5])).iso,
    };
  }
}

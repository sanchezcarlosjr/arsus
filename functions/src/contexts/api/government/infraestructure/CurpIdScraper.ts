import { CurpIdRepository } from '../domain/CurpIdRepository';
import { CurpResponse } from '../domain/CurpResponse';
import { CurpId } from '../domain/CurpId';
import { get } from 'request-promise';
import { getGroups } from '../../../shared/regex';
import { Database } from '../../../../database/database';
import admin from 'firebase-admin';
import moment = require('moment');

class CurpNotFound extends Error {
  constructor(value: string) {
    super(`CURP '${value}' not found`);
  }
}

export class CurpIdScraper extends CurpIdRepository {
  private htmlScrapePattern = /"([A-Z Ñ\-0-9.\/]*)";/gi;
  private genderISOConverter = new Map([
    ['H', '1'],
    ['M', '2'],
  ]);
  private database = new Database();

  async search(id: CurpId): Promise<CurpResponse> {
    const htmlResponse: string = await get(
      `http://sipso.sedesol.gob.mx/consultarCurp/consultaCurpR.jsp?cveCurp=${id.value}`
    );
    const data = getGroups(htmlResponse, this.htmlScrapePattern);
    if (!data[4]) {
      throw new CurpNotFound(id.value);
    }
    const states = this.database.collection('states').where('sedesolPattern', '==', data[5]);
    const birthState = await states.get().then((doc) => doc.docs[0].id);
    const document = {
      curp: id.value,
      fatherName: data[1],
      motherName: data[2],
      name: data[0],
      gender: this.genderISOConverter.get(data[4]),
      birthday: moment(data[3], 'DD/MM/YYYY').toISOString(),
      birthState,
    };
    try {
      return admin
        .firestore()
        .collection('id')
        .doc(document.curp)
        .set(document)
        .then(() => document);
    } catch (e) {
      throw new Error('Internal server');
    }
  }
}

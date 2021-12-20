import fetch from 'node-fetch';
import { CaptchaSolver } from './CaptchaSolver.js';
import { CurpIdRepository } from '../domain/CurpIdRepository.js';
import { Database } from '../shared/database.js';
import { CommandBatch } from '../application/CommandBatch.js';
import { CURPResponseCommand } from './CURPResponseCommand.js';

const genderISOConverter = new Map([
  ['HOMBRE', '1'],
  ['MUJER', '2'],
]);
const birthdayFormatFromRenapo = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/g;
const birthday = '$3-$2-$1T00:00:00.000Z';

export class CurpIdScraper extends CurpIdRepository {
  private database = new Database();

  async search(curpId: any) {
    CommandBatch.getInstance().addCommand(new CURPResponseCommand());
    const captchaSolver = new CaptchaSolver();
    const captchaSolution = await captchaSolver.solve(
      '6LdJssgUAAAAAKkVr-Aj-xP5QQzclPeGZmhRwXeY',
      'https://www.gob.mx/curp'
    );
    const renapoResponse: any = await fetch('https://www.gob.mx/v1/renapoCURP/consulta', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0',
        Accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
      referrer: 'https://www.gob.mx/',
      body: JSON.stringify({
        curp: curpId.value,
        tipoBusqueda: 'curp',
        ip: '127.0.0.1',
        response: captchaSolution,
      }),
      method: 'POST',
    }).then((res) => res.json());
    this.ensure(renapoResponse.codigo);
    return {
      curp: curpId.value,
      fatherName: renapoResponse.primerApellido,
      motherName: renapoResponse.segundoApellido,
      name: renapoResponse.nombres,
      gender: genderISOConverter.get(renapoResponse.sexo),
      birthday: renapoResponse.fechaNacimiento.replace(birthdayFormatFromRenapo, birthday),
      birthState: (await this.database.collection('states').showData(renapoResponse.claveEntidad)).iso,
      statusCurp: renapoResponse.statusCurp,
      nationality: renapoResponse.nacionalidad,
      probatoryDocument: renapoResponse.docProbatorio,
      probatoryDocumentData: {
        ...renapoResponse.datosDocProbatorio,
      },
    };
  }

  ensure(code: string) {
    switch (code) {
      case '01':
        return;
      case '02':
      case '03':
      case '04':
      case '05':
      case '07':
        throw new Error('Invalid 07');
      case '11':
      case '13':
        throw new Error('');
      case '180001':
      case '190001':
        return;
      default:
        throw new Error('');
    }
  }
}

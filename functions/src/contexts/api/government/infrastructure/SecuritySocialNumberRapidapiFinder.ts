import { config } from 'firebase-functions';
import { get } from 'request-promise';
import { warnByAPI } from '../../../shared/Error';

export interface IMSSResponse {
  datosPersonales: any;
}

export class SecuritySocialNumberRapidapiFinder {
  private record: IMSSResponse = {
    datosPersonales: null,
  };
  private isRegisteredInIMSS = false;
  constructor(private curp: string) {}
  private async request() {
    try {
      this.record = await get('https://imss.p.rapidapi.com/GetRecord', {
        qs: {
          curp: this.curp,
        },
        headers: {
          'x-rapidapi-host': 'imss.p.rapidapi.com',
          'x-rapidapi-key': config().rapidapi.key,
          useQueryString: true,
        },
        json: true,
      });
    } catch (e) {
      this.isRegisteredInIMSS = null;
      warnByAPI('SecuritySocialNumberRapidapiFinder', 17, e.message);
    }
  }
  async find() {
    await this.request();
    return this.doStrategy();
  }
  private doStrategy() {
    if (this.record.datosPersonales && this.record.datosPersonales.nss !== '') {
      return {
        isRegisteredInIMSS: true,
        nss: this.record.datosPersonales.nss,
        idAssignmentNss: this.record.datosPersonales.idAsignacionNss,
      };
    }
    return {
      isRegisteredInIMSS: this.isRegisteredInIMSS,
      nss: '',
      idAssignmentNss: -1,
    };
  }
}

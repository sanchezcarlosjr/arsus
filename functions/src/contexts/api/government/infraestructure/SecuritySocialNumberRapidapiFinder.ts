import { config } from 'firebase-functions';
import { get } from 'request-promise';

export interface IMSSResponse {
    datosPersonales: any;
}

export function warnByAPI(className: string, line: number, message: string, errorType = 'API REQUEST') {
    console.log('\x1b[33m%s\x1b[0m', `\t🔥 ERROR BY ${errorType} | In ${className} (LINE ${line}) | ${message.slice(0, 250)}`);
}

export class SecuritySocialNumberRapidapiFinder {
    private record: IMSSResponse = {
        datosPersonales: null
    };
    private isRegisteredInIMSS = false;
    constructor(private curp: string) { }
    private async request() {
        try {
            this.record = await get('https://imss.p.rapidapi.com/GetRecord', {
                qs: {
                    curp: this.curp
                },
                headers: {
                    'x-rapidapi-host': 'imss.p.rapidapi.com',
                    'x-rapidapi-key': config().rapidapi.key,
                    useQueryString: true
                },
                json: true
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
        if (this.record.datosPersonales && this.record.datosPersonales.nss !== "") {
            return {
                isRegisteredInIMSS: true,
                nss: this.record.datosPersonales.nss,
                idAssignmentNss: this.record.datosPersonales.idAsignacionNss,
            }
        }
        return {
            isRegisteredInIMSS: this.isRegisteredInIMSS,
            nss: "",
            idAssignmentNss: -1
        }
    }
}
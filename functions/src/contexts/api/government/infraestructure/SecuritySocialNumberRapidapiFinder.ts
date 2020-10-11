import { get } from 'request-promise';
const functions = require('firebase-functions');

export interface IMSSResponse {
    datosPersonales: any;
}

export class SecuritySocialNumberRapidapiFinder {
    private record: IMSSResponse = {
        datosPersonales: null
    };
    constructor(private curp: string) {}
    async find() {
        try {
            this.record = await get('https://imss.p.rapidapi.com/GetRecord', {
                        qs: {
                            curp: this.curp
                        },
                        headers: {
                            'x-rapidapi-host': 'imss.p.rapidapi.com',
                            'x-rapidapi-key': functions.config().rapidapi.key,
                            useQueryString: true
                        },
                        json: true
                })
             return this.doStrategy();
        } catch(e) {
             console.warn(e);
             return this.doStrategy();
        }
    }
    private doStrategy() {
        if (this.record.datosPersonales) {
            return {
                isRegisteredInIMSS: true, 
                nss:  this.record.datosPersonales.nss,
                idAssignmentNss: this.record.datosPersonales.idAsignacionNss,
            }
        }
        return  {
            isRegisteredInIMSS: false
        }
    }
}
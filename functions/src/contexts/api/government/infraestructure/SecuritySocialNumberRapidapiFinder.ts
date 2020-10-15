import { get } from 'request-promise';

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
                            'x-rapidapi-key': 'fb542f27admsh62a79f5c3c5c2e9p115517jsn1a7ef511ebd1',
                            useQueryString: true
                        },
                        json: true
                })
             return this.doStrategy();
        } catch(e) {
             if (e.message == '400 - "El CURP no tiene el formato correcto."') {
                 return {
                     isRegisteredInIMSS: null
                 };
             }
             console.warn(e.message);
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
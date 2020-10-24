import { get, post } from 'request-promise';
import { warnByAPI } from './SecuritySocialNumberRapidapiFinder';
const RFCFacil = require('rfc-facil');

export interface RFC {
    isLRFC: boolean,
    rfc: string,
    rfcBlockListStatus: string
}

export interface List {
    type: string;
    firstPublicationDate: Date;
    publicationDate?: any;
    amount?: number;
    reason: string;
}

export interface Blacklist69 {
    name: string;
    state: string;
    lists: List[];
}

export interface AllegedDetails {
    ogId: string;
    ogPublicationDate: Date;
    satPublicationDate: Date;
    dofPublicationDate: Date;
}

export interface DefinitiveDetails {
    ogId: string;
    ogPublicationDate: Date;
    satPublicationDate: Date;
    dofPublicationDate: Date;
}

export interface Blacklist69b {
    id?: string;
    name?: string;
    status: string;
    allegedDetails?: AllegedDetails;
    detractedDetails?: any;
    definitiveDetails?: DefinitiveDetails;
    favorableDetails?: any;
}

export interface RFCResponse {
    isValid: boolean;
    isRegistered: boolean;
    rfc: string;
    type: string;
    blacklist69: Blacklist69;
    blacklist69b: Blacklist69b;
}

export class RFCRapidapiFinder {
    private record: RFCResponse = {
        isValid: false,
        isRegistered: null,
        rfc: null,
        type: '',
        blacklist69: null,
        blacklist69b: {
            status: null
        },
    };
    private rfc: string = null;
    constructor(
        private name: string,
        private fatherName: string,
        private motherName: string,
        private birthday: string) {

    }
    async generate() {
        try {
            const response = (await get('https://jfhe88-rfc-generator-mexico.p.rapidapi.com/rest1/rfc/get', {
                qs: {
                    solo_homoclave: "0",
                    apellido_materno: this.motherName,
                    apellido_paterno: this.fatherName,
                    fecha: this.birthday.split("T")[0],
                    nombre: this.name
                },
                headers: {
                    'x-rapidapi-host': 'jfhe88-rfc-generator-mexico.p.rapidapi.com',
                    'x-rapidapi-key': 'fb542f27admsh62a79f5c3c5c2e9p115517jsn1a7ef511ebd1',
                    useQueryString: true
                },
                json: true
            }));
            this.rfc = response.response.data.rfc;
            if (!this.rfc) {
                const time = this.birthday.split("T")[0].split('-');
                this.rfc = RFCFacil.forNaturalPerson({
                    name: this.name,
                    firstLastName: this.fatherName,
                    secondLastName: this.motherName,
                    day: Number(time[2]),
                    month: Number(time[1]),
                    year: Number(time[0])
                });
            }
        } catch (e) {
            warnByAPI('RFCRapidapiFinder', 77, e.message);
        }
    }
    private async verify() {
        if (!this.rfc) {
            return;
        }
        try {
            this.record = await post('https://verifier.p.rapidapi.com/rfc/verify', {
                headers: {
                    'x-rapidapi-host': 'verifier.p.rapidapi.com',
                    'x-rapidapi-key': 'fb542f27admsh62a79f5c3c5c2e9p115517jsn1a7ef511ebd1',
                    'content-type': 'application/json',
                    accept: 'application/json',
                    useQueryString: true
                },
                body: { rfc: this.rfc },
                json: true
            });
        } catch (e) {
            if (e.message === `500 - {"error":{"code":"TYPE_ERROR","message":"Cannot read property 'replace' of undefined"}}`) {
                warnByAPI('RFCRapidapiFinder', 110, "Internal error - Cannot read property 'replace' of undefined");
            }
            else if (e.message === `500 - {"error":{"code":"ERROR","message":"Could not solve captcha"}}`) {
                warnByAPI('RFCRapidapiFinder', 110, "Internal error - Could not solve captcha");
            }
            else {
                warnByAPI('RFCRapidapiFinder', 110, e.message);
            }
        }
    }
    async find() {
        await this.generate();
        await this.verify();
        return this.doStrategy();
    }
    doStrategy(): RFC {
        return {
            isLRFC: this.record.isRegistered,
            rfc: this.rfc || null,
            rfcBlockListStatus: this.record.blacklist69b ? this.record.blacklist69b.status : null
        };
    }
}

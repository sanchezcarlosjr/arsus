const functions = require('firebase-functions');
import { get, post } from 'request-promise';

export interface RFC {
  isLRFC: boolean,
  rfc: string,
  blockListData: any,
  isRFCInBlockList: {
      id: string,
      actualStatus: string
  }
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
        id: string;
        name: string;
        status: string;
        allegedDetails: AllegedDetails;
        detractedDetails?: any;
        definitiveDetails: DefinitiveDetails;
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
    private record: RFCResponse = null;
    private rfc: string;
    constructor(
        private name: string,
        private fatherName: string, 
        private motherName: string,
        private birthday: string) {
        
    }
    private async generate() {
      const response = await get('https://jfhe88-rfc-generator-mexico.p.rapidapi.com/rest1/rfc/get', {
            qs: {
                solo_homoclave: "0",
                apellido_materno: this.motherName,
                apellido_paterno: this.fatherName,
                fecha: this.birthday.split("T")[0],
                nombre: this.name
            },
             headers: {
                'x-rapidapi-host': 'jfhe88-rfc-generator-mexico.p.rapidapi.com',
                'x-rapidapi-key': functions.config().rapidapi.key,
                useQueryString: true
            },
            json: true
      })
      this.rfc = response.response.data.rfc;
    }
    private async verify() {
      this.record = await post('https://verifier.p.rapidapi.com/rfc/verify', {
           headers: {
                'x-rapidapi-host': 'verifier.p.rapidapi.com',
                'x-rapidapi-key': functions.config().rapidapi.key,
                'content-type': 'application/json',
                accept: 'application/json',
                useQueryString: true
            },
            body: {rfc: this.rfc},
            json: true
      });
    }
    async find() {
      await this.generate();
      await this.verify();     
      return this.doStrategy();
    }
    private doStrategy(): RFC {
        return {
            isLRFC: this.record.isRegistered,
            rfc: this.rfc, 
            isRFCInBlockList: (this.record.blacklist69) ?  
            {
                id: this.record.blacklist69b.id,
                actualStatus: this.record.blacklist69b.status
            }: null,
            blockListData: {
                ...this.record.blacklist69,
                ...this.record.blacklist69b
            }
        };
    }
}
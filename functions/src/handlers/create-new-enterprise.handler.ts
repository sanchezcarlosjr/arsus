import * as https from 'firebase-functions/lib/providers/https';
import { Enterprise } from '../models/enterprise';

export interface EnterpriseForm {
  enterpriseData: {
    enterpriseName: string;
    enterpriseLegalName: string;
    cashFund: string;
    taxSystem: string;
    address: {
      state: string;
      city: string;
      zip: string;
      exterior: string;
      street: string;
    };
    system: string;
    _geoloc: {
      lat: number;
      lng: number;
    };
  };
  billing: {
    password: string;
  };
  enterpriseUID?: string;
}

export const createNewEnterpriseHandler = async (body: EnterpriseForm | null, context: https.CallableContext) => {
  return new Enterprise(body, context.auth.uid).store();
};

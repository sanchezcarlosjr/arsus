import { Database } from '../../database/database';

const Facturapi = require('facturapi');

interface User {
  enterprises: any;
  legalData: {
    legalName: string;
    facturapi?: string;
  };
}

export class Client {
  private facturapi: any;

  constructor(facturAPIsecretKey: string | string[]) {
    this.facturapi = new Facturapi(facturAPIsecretKey);
  }

  async store(userUID: string, enterpriseUID: string): Promise<{ id: string }> {
    const database = new Database();
    const user: User = await database.collection('users').showData(userUID);
    const clientIDAtFacturapi = user.enterprises ? user.enterprises[enterpriseUID] : undefined;
    if (clientIDAtFacturapi) {
      return {
        id: clientIDAtFacturapi,
      };
    }
    const response = await this.createAUserByOrganization(user.legalData);
    database.collection('users').update(userUID, {
      enterprises: {
        [`${enterpriseUID}`]: response.id,
      },
    });
    return response;
  }

  private async createAUserByOrganization(user: any): Promise<{ id: string }> {
    try {
      return await this.facturapi.customers.create({
        legal_name: user.legalName,
        email: user.email,
        tax_id: user.taxID,
      });
    } catch (e) {
      return null;
    }
  }
}

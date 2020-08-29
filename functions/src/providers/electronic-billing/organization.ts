import * as functions from 'firebase-functions';

import { Database } from '../../database/database';
import { EnterpriseForm } from '../../handlers/create-new-enterprise.handler';
import { BucketFile } from '../../models/file';

const Facturapi = require('facturapi');

export interface ApiKeyByOrganizationResponse {
  live_key: string;
  test_key: string;
}

export interface Address {
  street: string;
  exterior: string;
  interior: string;
  zip: string;
  neighborhood: string;
  city: string;
  municipality: string;
  state: string;
  country: string;
}

export interface Legal {
  name: string;
  legal_name: string;
  tax_id: string;
  tax_system: string;
  website: string;
  phone: string;
  address: Address;
}

export interface PdfExtra {
  codes: boolean;
  product_key: boolean;
}

export interface Customization {
  has_logo: boolean;
  color: string;
  pdf_extra: PdfExtra;
}

export interface Certificate {
  expires_at: Date;
  updated_at: Date;
  has_certificate: boolean;
}

export interface ResponseFacturapiOrganization {
  id: string;
  created_at: Date;
  is_production_ready: boolean;
  pending_steps: any[];
  legal: Legal;
  customization: Customization;
  certificate: Certificate;
}

export class Organization {
  private facturapiUser: any;
  private database = new Database();
  constructor() {
    const facturAPIKeyUser = functions.config().facturapi.userkey;
    this.facturapiUser = new Facturapi(facturAPIKeyUser);
  }

  async index(): Promise<any> {
    return await this.facturapiUser.organizations.list();
  }

  getApiKey(id: string): Promise<ApiKeyByOrganizationResponse> {
    return this.facturapiUser.organizations.getApiKeys(id);
  }

  async store(request: EnterpriseForm, userUID: string, enterpriseUID: string): Promise<any> {
    const response = await this.create(request);
    await this.update(response, request);
    await this.uploadLogo(response.id, userUID);
    const responseCSD: ResponseFacturapiOrganization = await this.uploadCSD(response, request, userUID);
    const apiKey = await this.getApiKey(response.id);
    const body = {
      services: {
        facturapi: {
          id: response.id,
          liveKey: apiKey.live_key,
          testKey: apiKey.test_key,
        },
      },
      legal: {
        taxID: responseCSD.legal.tax_id,
        certificate: responseCSD.certificate,
      },
    };
    await this.database.collection('enterprises').update(enterpriseUID, body);
    return body;
  }

  async uploadLogo(responseID: string, userUID: string) {
    const logo = new BucketFile(`users/${userUID}/logo`);
    await logo.download();
    const file = logo.readAsStream();
    return this.facturapiUser.organizations.uploadLogo(responseID, file);
  }

  async uploadCSD(response: any, request: EnterpriseForm, userUID: string) {
    const cer = new BucketFile(`users/${userUID}/CSD.cer`);
    const key = new BucketFile(`users/${userUID}/CSD.key`);
    await cer.download();
    await key.download();
    const cerFile = cer.readAsStream();
    const keyFile = key.readAsStream();
    const password = request.billing.password;
    const id = response.id;
    return await this.facturapiUser.organizations.uploadCertificate(id, cerFile, keyFile, password);
  }

  async update(response: any, request: EnterpriseForm) {
    return await this.facturapiUser.organizations.updateLegal(response.id, {
      name: request.enterpriseData.enterpriseName,
      legal_name: request.enterpriseData.enterpriseLegalName,
      tax_id: 'AAA010101AAA',
      tax_system: request.enterpriseData.taxSystem,
      address: {
        ...request.enterpriseData.address,
        municipality: request.enterpriseData.address.city,
      },
    });
  }

  async create(request: EnterpriseForm) {
    const enterpriseName = request.enterpriseData.enterpriseName;
    const response: {
      id: string;
    } = await this.facturapiUser.organizations.create({
      name: enterpriseName,
    });
    return response;
  }

  async show(id: string): Promise<any> {
    return await this.facturapiUser.organizations.retrieve(id);
  }
}

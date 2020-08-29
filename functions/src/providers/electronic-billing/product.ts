const Facturapi = require('facturapi');

export interface Tax {
  withholding: boolean;
  type: string;
  rate: number;
}

export interface ProductData {
  id?: string;
  created_at?: Date;
  livemode?: boolean;
  description?: string;
  product_key?: string;
  price?: number;
  sku?: string;
  services?: any;
  unit_name?: string;
  unit_key?: string;
  tax_included?: boolean;
  taxes?: Tax[];
}

export class Product {
  private facturapi: any;
  constructor(facturAPIsecretKey: string | string[]) {
    this.facturapi = new Facturapi(facturAPIsecretKey);
  }

  async store(resource: ProductData): Promise<{ id: string }> {
    return await this.facturapi.products.create(resource);
  }

  async update(facturapi: string, resource: ProductData) {
    return await this.facturapi.products.update(facturapi, resource);
  }
}

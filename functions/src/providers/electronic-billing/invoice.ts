import { Database } from '../../database/database';
import { StreamWrapper } from '../../models/file';

const Facturapi = require('facturapi');

export class Invoice {
  private facturapi: any;
  private invoiceID = '';

  constructor(facturAPIsecretKey: string | string[]) {
    this.facturapi = new Facturapi(facturAPIsecretKey);
  }

  async cancelInvoice(invoiceID: string) {
    return await this.facturapi.invoices.cancel(invoiceID);
  }

  async store(resource: any): Promise<any> {
    const newInvoice = await this.facturapi.invoices.create({
      customer: resource.costumer,
      items: resource.items,
      use: 'G03',
      payment_form: Facturapi.PaymentForm[resource.payment],
    });
    await this.facturapi.invoices.sendByEmail(newInvoice.id);
    this.invoiceID = newInvoice.id;
  }

  async upload(userUID: string, orderUID: string) {
    const pdfStream = await this.facturapi.invoices.downloadPdf(this.invoiceID);
    const pdf = new StreamWrapper(`${this.invoiceID}.pdf`, pdfStream);
    const invoicePDF = await pdf.write(`users/${userUID}/invoices/${this.invoiceID}.pdf`, 'application/pdf');
    const xmlStream = await this.facturapi.invoices.downloadXml(this.invoiceID);
    const xml = new StreamWrapper(`${this.invoiceID}.xml`, xmlStream);
    const invoiceXML = await xml.write(`users/${userUID}/invoices/${this.invoiceID}.xml`, 'text/xml');
    const database = new Database();
    database.collection('orders').update(orderUID, {
      invoicePDF,
      invoiceID: this.invoiceID,
      invoiceXML,
    });
  }
}

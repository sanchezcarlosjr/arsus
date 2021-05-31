import { INEModel } from '../domain/INEModel';

export class INEModelD extends INEModel {
  constructor(private cic: string, private ocr: string) {
    super();
  }

  toString(): string {
    return `INEModelD ${this.cic} ${this.ocr}`;
  }

  scrape(): any {
    console.log(this.ocr);
    console.log(this.cic);
  }

  match(obverse: string, back: string): INEModel {
    this.cic = back.match(/IDMEX(\d{9})/)[1];
    this.ocr = back.match(/<<(\d{13})\n/)[1];
    return this;
  }
}

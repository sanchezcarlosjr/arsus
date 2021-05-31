import { INEModel } from '../domain/INEModel';

export class INEModelEFGH extends INEModel {
  constructor(private id: string, private cic: string) {
    super();
  }

  toString(): string {
    return `INEModelEFGH ${this.cic} ${this.id}`;
  }

  scrape(): any {
    console.log(this.id);
    console.log(this.cic);
  }

  match(obverse: string, back: string): INEModel {
    this.cic = back.match(/IDMEX(\d{9})/)[1];
    this.id = back.match(/<<\d{4}(\d{9})\n/)[1];
    return this;
  }
}

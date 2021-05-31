import { INEModel } from '../domain/INEModel';

export class INEModelC extends INEModel {
  constructor(private electorKey: string, private emission: string, private ocr: string) {
    super();
  }

  toString(): string {
    return `INEModelD ${this.ocr} ${this.electorKey} ${this.emission}`;
  }

  scrape(userId: string): any {
    console.log(this.electorKey);
    console.log(this.emission);
    console.log(this.ocr);
  }

  match(obverse: string, back: string): INEModel {
    return this;
  }
}

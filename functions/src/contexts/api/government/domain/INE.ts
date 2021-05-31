export interface INEVisionResponse {
  curp: string;
  type: INEModel;
}

export abstract class INEModel {
  abstract match(obverse: string, back: string): INEModel;

  abstract scrape(): any;

  abstract toString(): string;
}

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

export class INEModelC extends INEModel {
  constructor(private electorKey: string, private emission: string, private ocr: string) {
    super();
  }

  toString(): string {
    return `INEModelD ${this.ocr} ${this.electorKey} ${this.emission}`;
  }

  scrape(): any {
    console.log(this.electorKey);
    console.log(this.emission);
    console.log(this.ocr);
  }

  match(obverse: string, back: string): INEModel {
    return this;
  }
}

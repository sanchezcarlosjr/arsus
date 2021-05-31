export abstract class INEModel {
  abstract match(obverse: string, back: string): INEModel;

  abstract scrape(): any;

  abstract toString(): string;
}
